import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { type Node as PMNode, type NodeType, Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

const extractNestedLists = (
	node: PMNode,
	listTypes: NodeType[],
	itemTypes: NodeType[],
	schema: Schema,
): PMNode[] => {
	const items: PMNode[] = [];
	const paragraph = schema.nodes.paragraph;

	const extract = (currentNode: PMNode): void => {
		currentNode.forEach((child) => {
			if (itemTypes.some((type) => child.type === type)) {
				const contentWithoutNestedLists: PMNode[] = [];
				const nestedLists: PMNode[] = [];

				child.forEach((grandChild) => {
					if (listTypes.some((type) => grandChild.type === type)) {
						nestedLists.push(grandChild);
					} else {
						if (grandChild.isText) {
							contentWithoutNestedLists.push(paragraph.createAndFill({}, grandChild) as PMNode);
						} else {
							contentWithoutNestedLists.push(grandChild);
						}
					}
				});

				items.push(child.copy(Fragment.from(contentWithoutNestedLists)));

				nestedLists.forEach((nestedList) => {
					extract(nestedList);
				});
			} else if (listTypes.some((type) => child.type === type)) {
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
					extractNestedLists(
						node,
						listTypes,
						[context.schema.nodes.listItem, context.schema.nodes.taskItem],
						context.schema,
					),
				),
			);
		}

		return node;
	});
};
