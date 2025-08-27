import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';

import type { FormatNodeTargetType } from './types';

export const getTargetNodeInfo = (
	targetType: FormatNodeTargetType,
	nodes: Record<string, NodeType>,
): { nodeType: NodeType; attrs?: Record<string, unknown> } | null => {
	switch (targetType) {
		case 'heading1':
			return { nodeType: nodes.heading, attrs: { level: 1 } };
		case 'heading2':
			return { nodeType: nodes.heading, attrs: { level: 2 } };
		case 'heading3':
			return { nodeType: nodes.heading, attrs: { level: 3 } };
		case 'heading4':
			return { nodeType: nodes.heading, attrs: { level: 4 } };
		case 'heading5':
			return { nodeType: nodes.heading, attrs: { level: 5 } };
		case 'heading6':
			return { nodeType: nodes.heading, attrs: { level: 6 } };
		case 'paragraph':
			return { nodeType: nodes.paragraph };
		case 'blockquote':
			return { nodeType: nodes.blockquote };
		case 'expand':
			return { nodeType: nodes.expand };
		case 'panel':
			return { nodeType: nodes.panel, attrs: { panelType: 'info' } };
		case 'codeblock':
			return { nodeType: nodes.codeBlock };
		case 'bulletList':
			return { nodeType: nodes.bulletList };
		case 'orderedList':
			return { nodeType: nodes.orderedList };
		case 'taskList':
			return { nodeType: nodes.taskList };
		default:
			return null;
	}
};

// Helper functions to categorize node types
export const isBlockNode = (node: PMNode): boolean => {
	return ['paragraph', 'heading', 'codeBlock'].includes(node.type.name);
};

export const isListNode = (node: PMNode): boolean => {
	return ['bulletList', 'orderedList', 'taskList', 'listItem'].includes(node.type.name);
};

export const isContainerNode = (node: PMNode): boolean => {
	return ['panel', 'expand', 'blockquote'].includes(node.type.name);
};

export const isBlockNodeType = (nodeType: NodeType): boolean => {
	return ['paragraph', 'heading', 'codeBlock'].includes(nodeType.name);
};

export const isListNodeType = (nodeType: NodeType): boolean => {
	return ['bulletList', 'orderedList', 'taskList'].includes(nodeType.name);
};

export const isContainerNodeType = (nodeType: NodeType): boolean => {
	return ['panel', 'expand', 'blockquote'].includes(nodeType.name);
};
