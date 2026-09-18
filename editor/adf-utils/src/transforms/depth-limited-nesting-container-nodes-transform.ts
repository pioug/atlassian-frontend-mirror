import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { traverse } from '../traverse/traverse';
import type { ADFEntity } from '../types';
import { panelC1FallbackTransform } from './panel-c1-fallback-transform';
import { panelC1FallbackTransformV2 } from './panel-c1-fallback-transform-v2';

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
 * Upgrades container nodes to their table-allowing variant wherever the schema allows it,
 * regardless of the node's content. Currently: `panel` -> `panel_c1` (document root / layout
 * column / synced block). Schema-driven and flag-free — a no-op when the schema does not declare
 * the variant.
 */
export const upgradeContainerNodes = (
	adf: ADFEntity,
	schema: Schema,
): {
	isTransformed: boolean;
	transformedAdf: ADFEntity | false;
} => {
	const panelC1AllowedParents = getPanelC1AllowedParentTypes(schema);
	if (panelC1AllowedParents.size === 0) {
		return { isTransformed: false, transformedAdf: adf };
	}

	let isTransformed = false;
	const transformedAdf = traverse(adf, {
		panel: (node, parent) => {
			const parentType = parent.node?.type;
			if (parentType && panelC1AllowedParents.has(parentType)) {
				isTransformed = true;
				return { ...node, type: 'panel_c1' };
			}
			return;
		},
	});

	return { isTransformed, transformedAdf };
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

	// Gate the generalised (table + expand + panel + blockquote + bodiedExtension) transform
	// behind the consolidated container-in-panel experiment; the in-production table-in-panel
	// path continues to use the deprecated table-only transform.
	const panelC1FallbackResult = isExperimentEnabled('platform_editor_nest_container_in_panel')
		? panelC1FallbackTransformV2(schema, transformedAdf)
		: panelC1FallbackTransform(schema, transformedAdf);
	if (panelC1FallbackResult.isTransformed && panelC1FallbackResult.transformedAdf) {
		isTransformed = true;
		transformedNodeTypes.add('panel_c1');
		transformedAdf = panelC1FallbackResult.transformedAdf;
	}

	const promotionResult = upgradeContainerNodes(transformedAdf, schema);
	if (promotionResult.isTransformed) {
		isTransformed = true;
		transformedNodeTypes.add('panel_c1');
	}

	return {
		transformedAdf: promotionResult.transformedAdf,
		isTransformed,
		transformedNodeTypes: Array.from(transformedNodeTypes),
	};
};
