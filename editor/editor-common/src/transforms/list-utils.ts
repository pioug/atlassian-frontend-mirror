import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';

// List type utilities
export const isBulletOrOrderedList = (nodeType: NodeType): boolean => {
	return nodeType.name === 'bulletList' || nodeType.name === 'orderedList';
};

export const isTaskList = (nodeType: NodeType): boolean => {
	return nodeType.name === 'taskList';
};

export const getSupportedListTypes = (nodes: Record<string, NodeType>): NodeType[] => {
	return [nodes.bulletList, nodes.orderedList, nodes.taskList].filter(Boolean);
};

export const getSupportedListTypesSet = (nodes: Record<string, NodeType>): Set<NodeType> => {
	return new Set(getSupportedListTypes(nodes));
};

/**
 * Convert a block node to inline content suitable for task items
 */
export const convertBlockToInlineContent = (node: PMNode, schema: Schema): PMNode[] => {
	const { paragraph } = schema.nodes;

	if (node.type === paragraph) {
		return [...node.content.content];
	}

	if (node.isBlock) {
		const textContent = node.textContent;
		return textContent ? [schema.text(textContent)] : [];
	}

	return [node];
};
