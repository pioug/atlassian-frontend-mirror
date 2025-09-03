import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

/**
 * Convert a block node to inline content suitable for task items
 */
const convertBlockToInlineContent = (node: PMNode, schema: Schema): PMNode[] => {
	const { paragraph } = schema.nodes;

	if (node.type === paragraph) {
		// Extract inline content from paragraphs
		return [...node.content.content];
	} else if (node.isBlock) {
		// For other block content types eg. codeBlock, extract their text content and create text nodes
		const textContent = node.textContent;
		if (textContent) {
			const textNode = schema.text(textContent);
			return [textNode];
		}
	} else {
		// Already inline content, add directly
		return [node];
	}

	return [];
};

/**
 * Transform list structure
 */
export const transformListStructure = (
	tr: Transaction,
	listNode: { node: PMNode; pos: number },
	targetNodeType: NodeType,
	nodes: Record<string, NodeType>,
) => {
	try {
		const { node: sourceList, pos: listPos } = listNode;
		const { bulletList, orderedList, taskList, listItem, taskItem, paragraph } = nodes;

		const isSourceBulletOrOrdered =
			sourceList.type === bulletList || sourceList.type === orderedList;
		const isTargetTask = targetNodeType === taskList;
		const isSourceTask = sourceList.type === taskList;

		const newListItems: PMNode[] = [];
		const listStart = listPos;
		const listEnd = listPos + sourceList.nodeSize;

		// Use nodesBetween to efficiently traverse the list structure
		tr.doc.nodesBetween(listStart, listEnd, (node, pos, parent) => {
			// Only process direct children of the list (depth 1)
			if (parent !== sourceList) {
				return true; // Continue traversal
			}

			if (isSourceBulletOrOrdered && isTargetTask) {
				// Converting from bullet/ordered list to task list
				// Extract inline content from all children within listItem
				if (node.type === listItem) {
					const inlineContent: PMNode[] = [];
					// Extract inline content from all child nodes
					node.forEach((child) => {
						inlineContent.push(...convertBlockToInlineContent(child, tr.doc.type.schema));
					});

					if (inlineContent.length > 0) {
						const newItem = taskItem.create(null, inlineContent);
						newListItems.push(newItem);
					}
				}
			} else if (isSourceTask && !isTargetTask) {
				// Converting from task list to bullet/ordered list
				// Structure: taskItem > inline content -> listItem > paragraph > inline content
				if (node.type === taskItem) {
					const inlineContent = [...node.content.content];

					if (inlineContent.length > 0) {
						const paragraphNode = paragraph.create(null, inlineContent);
						const newListItem = listItem.create(null, paragraphNode);
						newListItems.push(newListItem);
					}
				}
			}

			return false; // Don't traverse into children of list items
		});

		if (newListItems.length === 0) {
			return tr;
		}

		// Create new list with transformed items
		const newList = targetNodeType.create(null, newListItems);

		// Replace the entire list
		tr.replaceWith(listStart, listEnd, newList);

		return tr;
	} catch {
		return tr;
	}
};
