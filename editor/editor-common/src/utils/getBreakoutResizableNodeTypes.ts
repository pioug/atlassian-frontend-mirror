import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';

export const getBreakoutResizableNodeTypes = (schema: Schema): Set<NodeType> => {
	const { expand, codeBlock, layoutSection, syncBlock, bodiedSyncBlock } = schema.nodes;

	return new Set([expand, codeBlock, layoutSection, syncBlock, bodiedSyncBlock]);
};
