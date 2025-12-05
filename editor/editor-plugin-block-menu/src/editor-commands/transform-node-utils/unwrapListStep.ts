import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

/**
 * Given an array of nodes, processes each list removing all parent list nodes and
 * just returning their child contents.
 *
 * @example
 * Input:
 * - bulletList
 *   - listItem "1"
 *     - paragraph "1"
 *   - listItem "2"
 *     - paragraph "2"
 *
 * Output:
 * - paragraph "1"
 * - paragraph "2"
 *
 * @param nodes
 * @param context
 * @returns
 */
export const unwrapListStep: TransformStep = (nodes, context) => {
	const listTypes = [
		context.schema.nodes.bulletList,
		context.schema.nodes.orderedList,
		context.schema.nodes.taskList,
	];

	return nodes.flatMap((node) => {
		if (listTypes.some((type) => node.type === type)) {
			const listItems: PMNode[] = [];

			node.forEach((listItem) => {
				listItems.push(...listItem.children);
			});

			return listItems;
		}
		return node;
	});
};
