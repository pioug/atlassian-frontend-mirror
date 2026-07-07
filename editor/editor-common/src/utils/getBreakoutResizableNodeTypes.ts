import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';

export const getBreakoutResizableNodeTypes = (
	schema: Schema,
	isRuleAndPanelResizingEnabled: boolean = false,
): Set<NodeType> => {
	const { expand, codeBlock, layoutSection, syncBlock, bodiedSyncBlock, rule, panel, panel_c1 } =
		schema.nodes;

	const breakoutResizableNodeTypes = [expand, codeBlock, layoutSection, syncBlock, bodiedSyncBlock];
	if (isRuleAndPanelResizingEnabled) {
		breakoutResizableNodeTypes.push(rule, panel, panel_c1);
	}

	return new Set(breakoutResizableNodeTypes);
};
