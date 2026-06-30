import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { ADFEntity } from '../types';
import { traverse } from '../traverse/traverse';
import { panelC1FallbackTransform } from './panel-c1-fallback-transform';

/**
 * Returns the set of parent node names whose content expression in the
 * supplied schema allows a `panel_c1` child. Returns an empty set if the
 * schema does not declare a `panel_c1` node.
 */
const getPanelC1AllowedParentTypes = (schema: Schema): Set<string> => {
	const panelC1Type = schema.nodes['panel_c1'];
	if (!panelC1Type) {
		return new Set();
	}

	const allowed = new Set<string>();
	for (const nodeType of Object.values(schema.nodes)) {
		if (nodeType.contentMatch?.matchType(panelC1Type)) {
			allowed.add(nodeType.name);
		}
	}
	return allowed;
};

/**
 * Applies schema-driven panel container transforms:
 * - downgrades/restores `panel_c1` content via the fallback transform when gated on
 * - promotes `panel` nodes to `panel_c1` wherever the schema allows it
 */
export const transformContainerNodes = (
	adf: ADFEntity,
	schema: Schema,
): {
	isTransformed: boolean;
	transformedAdf: ADFEntity | false;
	transformedNodeTypes: string[];
} => {
	let isTransformed: boolean = false;
	const transformedNodeTypes = new Set<string>();
	let transformedAdf: ADFEntity = adf;

	const panelC1FallbackResult = panelC1FallbackTransform(schema, transformedAdf);
	if (panelC1FallbackResult.isTransformed && panelC1FallbackResult.transformedAdf) {
		isTransformed = true;
		transformedNodeTypes.add('panel_c1');
		transformedAdf = panelC1FallbackResult.transformedAdf;
	}

	const panelC1AllowedParents = getPanelC1AllowedParentTypes(schema);

	const promotedAdf = traverse(transformedAdf, {
		panel: (node, parent) => {
			const parentType = parent.node?.type;
			if (parentType && panelC1AllowedParents.has(parentType)) {
				isTransformed = true;
				transformedNodeTypes.add('panel_c1');
				return { ...node, type: 'panel_c1' };
			}
			return;
		},
	});

	return {
		transformedAdf: promotedAdf,
		isTransformed,
		transformedNodeTypes: Array.from(transformedNodeTypes),
	};
};
