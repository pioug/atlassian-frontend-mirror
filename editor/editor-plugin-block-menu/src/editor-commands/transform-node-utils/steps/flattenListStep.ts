import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { type Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';

import { isListWithIndentation } from '../nodeChecks';
import type { TransformStep } from '../types';

const extractNestedLists = (node: PMNode, schema: Schema): PMNode[] => {
	const items: PMNode[] = [];
	const paragraph = schema.nodes.paragraph;
	const itemTypes = [schema.nodes.listItem, schema.nodes.taskItem, schema.nodes.decisionItem];

	const extract = (currentNode: PMNode): void => {
		currentNode.forEach((child) => {
			if (itemTypes.some((type) => child.type === type)) {
				const contentWithoutNestedLists: PMNode[] = [];
				const nestedLists: PMNode[] = [];

				// Check if this item type expects inline content (taskItem, decisionItem)
				// vs block content (listItem) based on the schema definition
				const isInlineItem = child.type.inlineContent;

				child.forEach((grandChild) => {
					if (isListWithIndentation(grandChild.type.name, schema)) {
						nestedLists.push(grandChild);
					} else if (grandChild.isText) {
						// For taskItem/decisionItem, keep text as-is (they support inline content)
						// For listItem, wrap text in paragraph (they require block content)
						if (isInlineItem) {
							contentWithoutNestedLists.push(grandChild);
						} else {
							contentWithoutNestedLists.push(paragraph.createAndFill({}, grandChild) as PMNode);
						}
					} else {
						contentWithoutNestedLists.push(grandChild);
					}
				});

				items.push(child.copy(Fragment.from(contentWithoutNestedLists)));

				nestedLists.forEach((nestedList) => {
					extract(nestedList);
				});
			} else if (isListWithIndentation(child.type.name, schema)) {
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
	return nodes.map((node) => {
		if (isListWithIndentation(node.type.name, context.schema)) {
			return node.copy(Fragment.from(extractNestedLists(node, context.schema)));
		}

		return node;
	});
};
