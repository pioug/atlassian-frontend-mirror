import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

/**
 * Extract all inline content from a node
 */
const extractInlineContent = (node: PMNode): PMNode[] => {
	const inlineContent: PMNode[] = [];
	for (let i = 0; i < node.childCount; i++) {
		inlineContent.push(node.child(i));
	}
	return inlineContent;
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

					// Extract all inline content from all child nodes
					for (let i = 0; i < node.childCount; i++) {
						const child = node.child(i);
						if (child.type === paragraph) {
							// Extract inline content from paragraphs
							inlineContent.push(...extractInlineContent(child));
						} else if (child.isBlock) {
							// For other block content types eg. codeBlock, extract their text content and create text nodes
							const textContent = child.textContent;
							if (textContent) {
								const textNode = tr.doc.type.schema.text(textContent);
								inlineContent.push(textNode);
							}
						} else {
							// Already inline content, add directly
							inlineContent.push(child);
						}
					}
					if (inlineContent.length > 0) {
						const newItem = taskItem.create(null, inlineContent);
						newListItems.push(newItem);
					}
				}
			} else if (isSourceTask && !isTargetTask) {
				// Converting from task list to bullet/ordered list
				// Structure: taskItem > inline content -> listItem > paragraph > inline content
				if (node.type === taskItem) {
					const inlineContent = extractInlineContent(node);

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
