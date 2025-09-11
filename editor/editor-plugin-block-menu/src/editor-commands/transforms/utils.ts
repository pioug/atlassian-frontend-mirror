import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { FormatNodeTargetType } from './types';

export const getTargetNodeInfo = (
	targetType: FormatNodeTargetType,
	nodes: Record<string, NodeType>,
): { attrs?: Record<string, unknown>; nodeType: NodeType } | null => {
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
		case 'codeBlock':
			return { nodeType: nodes.codeBlock };
		case 'bulletList':
			return { nodeType: nodes.bulletList };
		case 'orderedList':
			return { nodeType: nodes.orderedList };
		case 'taskList':
			return { nodeType: nodes.taskList };
		case 'layoutSection':
			return { nodeType: nodes.layoutSection };
		default:
			return null;
	}
};

// Helper functions to categorize node types
export const isBlockNode = (node: PMNode): boolean => {
	return ['paragraph', 'heading', 'codeBlock'].includes(node.type.name);
};

export const isHeadingOrParagraphNode = (node: PMNode): boolean => {
	return ['paragraph', 'heading'].includes(node.type.name);
};

export const isListNode = (node: PMNode): boolean => {
	return ['bulletList', 'orderedList', 'taskList'].includes(node.type.name);
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

// List type utilities moved to @atlaskit/editor-common/transforms

export const isLayoutNodeType = (nodeType: NodeType): boolean => {
	return nodeType.name === 'layoutSection';
};

export const isLayoutNode = (node: PMNode): boolean => {
	return node.type.name === 'layoutSection';
};

/**
 * Check if a node should be extracted as a standalone block node
 * rather than converted to inline content
 */
export const isBlockNodeForExtraction = (node: PMNode): boolean => {
	const blockNodesForExtraction = [
		'table',
		'mediaSingle',
		'extension',
		'bodiedExtension',
		'blockCard',
		'embedCard',
	];

	return blockNodesForExtraction.includes(node.type.name);
};

/**
 * Get a function that checks if content is supported in the target container type
 */
export const getContentSupportChecker = (targetNodeType: NodeType): ((node: PMNode) => boolean) => {
	return (node: PMNode): boolean => {
		// Check if the target container type can contain this node
		try {
			return targetNodeType.validContent(Fragment.from(node));
		} catch {
			return false;
		}
	};
};

/**
 * Convert a node to inline content that can be placed in a paragraph
 */
export const convertNodeToInlineContent = (node: PMNode, schema: Schema): PMNode[] => {
	// Extract text and inline nodes from any complex node
	const inlineNodes: PMNode[] = [];
	node.descendants((childNode: PMNode) => {
		if (childNode.isText) {
			inlineNodes.push(childNode);
		} else if (childNode.isInline) {
			inlineNodes.push(childNode);
		}
		return true; // Continue traversing
	});

	// If no inline content was found but the node has text content,
	// create a text node with the full text content
	if (inlineNodes.length === 0 && node.textContent) {
		return [schema.text(node.textContent)];
	}

	return inlineNodes;
};

/**
 * Filter marks from content based on the target node type
 * @param content The content fragment to filter
 * @param targetNodeType The target node type to check against
 * @returns A new fragment with marks filtered for the target node type
 */
export const filterMarksForTargetNodeType = (
	content: Fragment,
	targetNodeType: NodeType,
): Fragment => {
	const withValidMarks: PMNode[] = [];
	content.forEach((node) => {
		if (node.marks.length > 0) {
			const allowedMarks = targetNodeType.allowedMarks(node.marks);
			const updatedNode = node.mark(allowedMarks);
			withValidMarks.push(updatedNode);
		} else {
			withValidMarks.push(node);
		}
	});
	return Fragment.from(withValidMarks);
};

/** * Convert content from a code block node into multiple paragraph nodes
 */
export const convertCodeBlockContentToParagraphs = (
	codeBlockNode: PMNode,
	schema: Schema,
): PMNode[] => {
	const paragraphNodes: PMNode[] = [];
	const codeText = codeBlockNode.textContent;
	const lines = codeText.split('\n');
	lines.forEach((line) => {
		const paragraphNode = schema.nodes.paragraph.create(null, line ? schema.text(line) : null);
		paragraphNodes.push(paragraphNode);
	});
	return paragraphNodes;
};
