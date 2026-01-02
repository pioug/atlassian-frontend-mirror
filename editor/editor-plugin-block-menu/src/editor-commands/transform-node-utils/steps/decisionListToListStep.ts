import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { type Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';

import type { NodeTypeName, TransformStep } from '../types';

const targets = (targetNodeTypeName: NodeTypeName, schema: Schema) => {
	let targetListType;
	let targetItemType;

	switch (targetNodeTypeName) {
		case 'bulletList':
			targetListType = schema.nodes.bulletList;
			targetItemType = schema.nodes.listItem;
			break;
		case 'orderedList':
			targetListType = schema.nodes.orderedList;
			targetItemType = schema.nodes.listItem;
			break;
		case 'taskList':
			targetListType = schema.nodes.taskList;
			targetItemType = schema.nodes.taskItem;
			break;
		default:
	}

	return { targetListType, targetItemType };
};

/**
 * Transforms a decisionList into a bulletList, orderedList, or taskList.
 * Decision items are converted to the appropriate list item type.
 *
 * @example
 * Input (decisionList):
 * - decisionList
 *   - decisionItem "Task 1"
 *   - decisionItem "Task 2"
 *
 * Output (bulletList):
 * - bulletList
 *   - listItem
 *     - paragraph "Task 1"
 *   - listItem
 *     - paragraph "Task 2"
 *
 * Output (taskList):
 * - taskList
 *   - taskItem
 *     - paragraph "Task 1"
 *   - taskItem
 *     - paragraph "Task 2"
 *
 * @param nodes - Array of nodes to transform
 * @param context - Transform context with schema and target node type
 * @returns array of transformed nodes
 */
export const decisionListToListStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;
	const paragraphType = schema.nodes.paragraph;

	return nodes.map((node) => {
		if (node.type !== schema.nodes.decisionList) {
			return node;
		}

		const { targetListType, targetItemType } = targets(targetNodeTypeName, schema);

		if (!targetListType || !targetItemType) {
			return node;
		}

		const newItems: PMNode[] = [];

		node.forEach((decisionItem) => {
			const newItem = targetItemType.inlineContent
				? targetItemType.create({}, decisionItem.children)
				: targetItemType.create({}, paragraphType.create({}, decisionItem.children));

			if (newItem) {
				newItems.push(newItem);
			}
		});

		const newList = targetListType.create({}, Fragment.from(newItems));

		return newList || node;
	});
};
