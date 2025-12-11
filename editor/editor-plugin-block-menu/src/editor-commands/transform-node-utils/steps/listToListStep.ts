import { type Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from '../types';
import { isListType } from '../utils';

/**
 * Converts FROM taskList structure TO bulletList/orderedList structure.
 */
const convertFromTaskListStructure = (
	node: PMNode,
	targetListType: string,
	targetItemType: string,
): PMNode => {
	const schema = node.type.schema;
	const targetListNodeType = schema.nodes[targetListType];

	const convertedItems: PMNode[] = [];

	node.content.forEach((child) => {
		if (isListType(child, schema)) {
			// This is a nested list - it should become a child of the previous item
			if (convertedItems.length > 0) {
				const previousItem = convertedItems[convertedItems.length - 1];
				// Convert the nested list and add it to the previous item's content
				const convertedNestedList = transformList(child, targetListType, targetItemType);
				const newContent = previousItem.content.append(Fragment.from([convertedNestedList]));
				const updatedItem = previousItem.type.create(previousItem.attrs, newContent);
				convertedItems[convertedItems.length - 1] = updatedItem;
			}
			// If there's no previous item, skip this nested list (orphaned)
		} else {
			const convertedItem = transformListItem(child, targetItemType, targetListType);
			if (convertedItem) {
				convertedItems.push(convertedItem);
			}
		}
	});

	return targetListNodeType.create(node.attrs, Fragment.from(convertedItems));
};

/**
 * Converts FROM bulletList/orderedList structure TO taskList structure.
 */
const convertToTaskListStructure = (
	node: PMNode,
	targetListType: string,
	targetItemType: string,
): PMNode => {
	const schema = node.type.schema;
	const targetListNodeType = schema.nodes[targetListType];
	const transformedContent: PMNode[] = [];

	node.content.forEach((itemNode) => {
		const transformedItem = transformListItem(itemNode, targetItemType, targetListType, true);

		if (transformedItem) {
			transformedContent.push(transformedItem);
		}

		itemNode.content.forEach((child) => {
			if (isListType(child, schema)) {
				const transformedNestedList = transformList(child, targetListType, targetItemType);
				transformedContent.push(transformedNestedList);
			}
		});
	});

	return targetListNodeType.create(node.attrs, Fragment.from(transformedContent));
};

/**
 * Converts a single list item (listItem or taskItem) to the target item type.
 * Handles content transformation based on the target type's requirements.
 * @param itemNode - The list item node to convert
 * @param targetItemType - The target item type (listItem or taskItem)
 * @param targetListType - The target list type (bulletList, orderedList, or taskList)
 * @param excludeNestedLists - When true, nested lists are excluded from the item's content
 *                             (used when converting to taskList where nested lists become siblings)
 */
const transformListItem = (
	itemNode: PMNode,
	targetItemType: string,
	targetListType: string,
	excludeNestedLists: boolean = false,
): PMNode | null => {
	const schema = itemNode.type.schema;
	const targetItemNodeType = schema.nodes[targetItemType];
	const isTargetTaskItem = targetItemType === 'taskItem';
	const isSourceTaskItem = itemNode.type.name === 'taskItem';
	const paragraphType = schema.nodes.paragraph;

	if (!targetItemNodeType) {
		return null;
	}

	if (isTargetTaskItem) {
		const inlineContent: PMNode[] = [];

		itemNode.content.forEach((child) => {
			if (child.type === paragraphType) {
				child.content.forEach((inline) => {
					inlineContent.push(inline);
				});
			}
			if (child.isText) {
				inlineContent.push(child);
			}
			// TODO: EDITOR-3887 - Skip mediaSingle, codeBlock, and nested lists
			// Nested lists will be extracted and placed as siblings in the taskList
		});

		return targetItemNodeType.create({}, Fragment.from(inlineContent));
	} else {
		const newContent: PMNode[] = [];

		if (isSourceTaskItem) {
			newContent.push(paragraphType.create(null, itemNode.content));
		} else {
			itemNode.content.forEach((child) => {
				if (isListType(child, schema)) {
					if (excludeNestedLists) {
						// Skip nested lists - they will be handled separately as siblings
						return;
					}
					newContent.push(transformList(child, targetListType, targetItemType));
				} else {
					newContent.push(child);
				}
			});
		}

		if (newContent.length === 0) {
			newContent.push(paragraphType.create());
		}

		return targetItemNodeType.create({}, Fragment.from(newContent));
	}
};

/**
 * Recursively converts nested lists to the target list type.
 * This function handles the conversion of both the list container and its items,
 * including any nested lists within those items.
 *
 * Important: taskList has a different nesting structure than bulletList/orderedList:
 * - taskList: nested taskLists are SIBLINGS of taskItems in the parent taskList
 * - bulletList/orderedList: nested lists are CHILDREN of listItems
 */
const transformList = (node: PMNode, targetListType: string, targetItemType: string): PMNode => {
	const schema = node.type.schema;
	const targetListNodeType = schema.nodes[targetListType];
	const targetItemNodeType = schema.nodes[targetItemType];
	const taskListType = schema.nodes.taskList;

	if (!targetListNodeType || !targetItemNodeType) {
		return node;
	}

	const isSourceTaskList = node.type === taskListType;
	const isTargetTaskList = targetListType === 'taskList';

	if (isSourceTaskList && !isTargetTaskList) {
		return convertFromTaskListStructure(node, targetListType, targetItemType);
	} else if (!isSourceTaskList && isTargetTaskList) {
		return convertToTaskListStructure(node, targetListType, targetItemType);
	} else {
		const transformedItems: PMNode[] = [];
		node.content.forEach((childNode) => {
			const transformedItem = isListType(childNode, schema)
				? transformList(childNode, targetListType, targetItemType)
				: transformListItem(childNode, targetItemType, targetListType);

			if (transformedItem) {
				transformedItems.push(transformedItem);
			}
		});

		return targetListNodeType.create(node.attrs, Fragment.from(transformedItems));
	}
};

/**
 * Transform step that converts between bulletList, orderedList, and taskList types.
 * This step maintains the order and indentation of the list by recursively
 * converting all nested lists while preserving the structure. It also handles
 * conversion between listItem and taskItem types.
 *
 * When converting to taskList/taskItem, unsupported content (images, codeBlocks) is filtered out.
 *
 * @example
 * Input (bulletList with nested bulletList):
 * - bulletList
 *   - listItem "1"
 *     - bulletList
 *       - listItem "1.1"
 *         - bulletList
 *           - listItem "1.1.1"
 *       - listItem "1.2"
 *   - listItem "2"
 *
 * Output (orderedList with nested orderedList):
 * 1. orderedList
 *    1. listItem "1"
 *       1. orderedList
 *          1. listItem "1.1"
 *             1. orderedList
 *                1. listItem "1.1.1"
 *          2. listItem "1.2"
 *    2. listItem "2"
 *
 * @example
 * Input (bulletList with nested taskList):
 * - bulletList
 *   - listItem "Regular item"
 *     - taskList
 *       - taskItem "Task 1" (checked)
 *       - taskItem "Task 2" (unchecked)
 *
 * Output (orderedList with nested orderedList, taskItems converted to listItems):
 * 1. orderedList
 *    1. listItem "Regular item"
 *       1. orderedList
 *          1. listItem "Task 1"
 *          2. listItem "Task 2"
 *
 * @example
 * Input (bulletList to taskList, with paragraph extraction):
 * - bulletList
 *   - listItem
 *     - paragraph "Text content"
 *   - listItem
 *     - paragraph "Text"
 *     - codeBlock "code"
 *     - mediaSingle (image)
 *
 * Output (taskList with text extracted from paragraphs, unsupported content filtered):
 * - taskList
 *   - taskItem "Text content" (text extracted from paragraph)
 *   - taskItem "Text" (text extracted, codeBlock and image filtered out)
 *
 * @param nodes - The nodes to transform
 * @param context - The transformation context containing schema and target node type
 * @returns The transformed nodes
 */
export const listToListStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;

	return nodes.map((node) => {
		if (isListType(node, schema)) {
			const targetItemType = targetNodeTypeName === 'taskList' ? 'taskItem' : 'listItem';

			return transformList(node, targetNodeTypeName, targetItemType);
		}

		return node;
	});
};
