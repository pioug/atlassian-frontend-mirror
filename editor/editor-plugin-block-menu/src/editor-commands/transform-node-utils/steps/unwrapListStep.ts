import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from '../types';

/**
 * Given an array of nodes, processes each list removing all parent list nodes and
 * just returning their child contents.
 *
 * For lists with block content (bulletList, orderedList), it extracts the block nodes directly.
 * For lists with inline content (taskList, decisionList), it wraps the content in paragraphs.
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
		context.schema.nodes.decisionList,
	];

	return nodes.flatMap((node) => {
		if (listTypes.some((type) => node.type === type)) {
			const listItems: PMNode[] = [];

			node.forEach((listItem) => {
				// if isTaskItem or isDecisionItem, convert to paragraph
				if (listItem.type.name === 'taskItem' || listItem.type.name === 'decisionItem') {
					listItems.push(context.schema.nodes.paragraph.create({}, listItem.content));
				} else {
					listItems.push(...listItem.children);
				}
			});

			return listItems;
		}
		return node;
	});
};
