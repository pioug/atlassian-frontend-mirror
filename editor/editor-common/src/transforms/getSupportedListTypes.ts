import type { NodeType } from '@atlaskit/editor-prosemirror/model';

export const getSupportedListTypes = (nodes: Record<string, NodeType>): NodeType[] => {
	return [nodes.bulletList, nodes.orderedList, nodes.taskList].filter(Boolean);
};
