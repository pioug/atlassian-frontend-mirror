import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { ADFEntity } from '../types';
import { traverse } from '../traverse/traverse';

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
 * Promotes nodes to their _c1 variant wherever the schema allows it.
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

	const panelC1AllowedParents = getPanelC1AllowedParentTypes(schema);

	const transformedAdf = traverse(adf, {
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
		transformedAdf,
		isTransformed,
		transformedNodeTypes: Array.from(transformedNodeTypes),
	};
};
