import { type Node as PMNode, type NodeType, Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

const extractNestedLists = (
	node: PMNode,
	listTypes: NodeType[],
	itemTypes: NodeType[],
): PMNode[] => {
	const items: PMNode[] = [];

	const extract = (currentNode: PMNode): void => {
		currentNode.forEach((child) => {
			// list item -> take content without nested lists, then recurse into nested lists
			if (itemTypes.some((type) => child.type === type)) {
				// Filter out nested list nodes from the list item's content
				const contentWithoutNestedLists: PMNode[] = [];
				const nestedLists: PMNode[] = [];
				child.forEach((grandChild) => {
					if (listTypes.some((type) => grandChild.type === type)) {
						// This is a nested list - collect it for later processing
						nestedLists.push(grandChild);
					} else {
						// This is regular content (paragraph, etc.) - keep it
						contentWithoutNestedLists.push(grandChild);
					}
				});

				// Add the list item with only its non-list content
				items.push(child.copy(Fragment.from(contentWithoutNestedLists)));

				// Now process nested lists to maintain document order
				nestedLists.forEach((nestedList) => {
					extract(nestedList);
				});
			}
			// lists -> keep operating
			else if (listTypes.some((type) => child.type === type)) {
				extract(child);
			}
		});
	};

	extract(node);

	return items;
};

/**
 * Given an array of nodes, returns an array with the flattened children of any list node
 * to it's first ancestor list, maintaining document order.
 *
 * @example
 * Input:
 * - bulletList
 *   - listItem "A"
 *   - listItem "B"
 *     - bulletList
 *       - listItem "C"
 *       - listItem "D"
 *   - listItem "E"
 *
 * Output:
 * - bulletList
 *   - listItem "A"
 *   - listItem "B"
 *   - listItem "C"
 *   - listItem "D"
 *   - listItem "E"
 *
 * @example
 * Input (deeply nested):
 * - bulletList
 *   - listItem "1"
 *     - bulletList
 *       - listItem "1.1"
 *         - bulletList
 *           - listItem "1.1.1"
 *       - listItem "1.2"
 *   - listItem "2"
 *
 * Output:
 * - bulletList
 *   - listItem "1"
 *   - listItem "1.1"
 *   - listItem "1.1.1"
 *   - listItem "1.2"
 *   - listItem "2"
 *
 * @param nodes
 * @param context
 * @returns
 *
 * TODO: Lists with mixed types (e.g. bulletList with a taskItem) doesn't full flatten
 */
export const flattenListStep: TransformStep = (nodes, context) => {
	const listTypes = [
		context.schema.nodes.bulletList,
		context.schema.nodes.orderedList,
		context.schema.nodes.taskList,
	];

	return nodes.map((node) => {
		if (listTypes.some((type) => node.type === type)) {
			return node.copy(
				Fragment.from(
					extractNestedLists(node, listTypes, [
						context.schema.nodes.listItem,
						context.schema.nodes.taskItem,
					]),
				),
			);
		}

		return node;
	});
};
