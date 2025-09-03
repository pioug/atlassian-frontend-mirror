import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

/**
 * Transform selection to task list
 * Handles the special structure where taskItem contains text directly (no paragraph wrapper)
 */
export const transformToTaskList = (
	tr: Transaction,
	range: { end: number; start: number },
	targetNodeType: NodeType,
	targetAttrs: Record<string, unknown> | undefined,
	nodes: Record<string, NodeType>,
): Transaction | null => {
	try {
		const { taskItem } = nodes;
		const listItems: PMNode[] = [];

		// Process each block in the range
		tr.doc.nodesBetween(range.start, range.end, (node) => {
			if (node.isBlock) {
				// For block nodes like paragraphs, directly use their inline content
				const inlineContent = [...node.content.content];

				if (inlineContent.length > 0) {
					// Create task item with inline content directly
					const listItem = taskItem.create(targetAttrs, inlineContent);
					listItems.push(listItem);
				}
			}

			return false; // Don't traverse into children
		});

		if (listItems.length === 0) {
			return null;
		}

		// Create the new task list
		const newList = targetNodeType.create(targetAttrs, listItems);

		// Replace the range with the new list
		tr.replaceWith(range.start, range.end, newList);

		return tr;
	} catch {
		return null;
	}
};
