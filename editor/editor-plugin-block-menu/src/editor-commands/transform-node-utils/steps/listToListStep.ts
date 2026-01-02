import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { type Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';

import { isListWithIndentation } from '../nodeChecks';
import type { TransformStep, TransformStepContext } from '../types';

/**
 * Recursively converts nested lists to the target list type.
 * This function handles the conversion of both the list container and its items,
 * including any nested lists within those items.
 *
 * Important: taskList has a different nesting structure than bulletList/orderedList:
 * - taskList: nested taskLists are SIBLINGS of taskItems in the parent taskList
 * - bulletList/orderedList: nested lists are CHILDREN of listItems
 */
const transformList = (
	node: PMNode,
	targetListType: string,
	targetItemType: string,
	unsupportedContent: PMNode[],
): PMNode => {
	const schema = node.type.schema;
	const taskListType = schema.nodes.taskList;

	const isSourceTaskList = node.type === taskListType;
	const isTargetTaskList = targetListType === taskListType.name;

	const convertFromTaskListStructure = (
		node: PMNode,
		targetListType: string,
		targetItemType: string,
	): PMNode => {
		const schema = node.type.schema;
		const targetListNodeType = schema.nodes[targetListType];

		const transformedContent: PMNode[] = [];

		node.forEach((child) => {
			if (isListWithIndentation(child.type.name, schema)) {
				// This is a nested list - it should become a child of the previous item
				if (transformedContent.length > 0) {
					const previousItem = transformedContent[transformedContent.length - 1];
					// Convert the nested list and add it to the previous item's content
					const transformedNestedList = transformList(
						child,
						targetListType,
						targetItemType,
						unsupportedContent,
					);
					const newContent = previousItem.content.append(Fragment.from([transformedNestedList]));
					const updatedItem = previousItem.type.create(previousItem.attrs, newContent);
					transformedContent[transformedContent.length - 1] = updatedItem;
				}
				// If there's no previous item, skip this nested list (orphaned)
			} else {
				const transformedItem = transformListItem(child, targetListType, targetItemType);
				if (transformedItem) {
					transformedContent.push(transformedItem);
				}
			}
		});

		return targetListNodeType.create(node.attrs, transformedContent);
	};

	const convertToTaskListStructure = (
		node: PMNode,
		targetListType: string,
		targetItemType: string,
	): PMNode => {
		const schema = node.type.schema;
		const targetListNodeType = schema.nodes[targetListType];
		const transformedContent: PMNode[] = [];

		node.forEach((itemNode) => {
			const transformedItem = transformListItem(itemNode, targetListType, targetItemType, true);

			if (transformedItem) {
				transformedContent.push(transformedItem);
			}

			itemNode.forEach((child) => {
				if (isListWithIndentation(child.type.name, schema)) {
					transformedContent.push(
						transformList(child, targetListType, targetItemType, unsupportedContent),
					);
				}
			});
		});

		return targetListNodeType.create(node.attrs, transformedContent);
	};

	const transformListItem = (
		itemNode: PMNode,
		targetListType: string,
		targetItemType: string,
		excludeNestedLists: boolean = false,
	): PMNode | null => {
		const schema = itemNode.type.schema;
		const targetItemNodeType = schema.nodes[targetItemType];
		const isTargetTaskItem = targetItemType === 'taskItem';
		const isSourceTaskItem = itemNode.type.name === 'taskItem';
		const paragraphType = schema.nodes.paragraph;

		if (isTargetTaskItem) {
			const inlineContent: PMNode[] = [];

			itemNode.forEach((child) => {
				if (child.type === paragraphType) {
					inlineContent.push(...child.children);
				} else if (child.isInline) {
					inlineContent.push(child);
					// Nested lists will be extracted and placed as siblings in the taskList
				} else if (!isListWithIndentation(child.type.name, schema)) {
					unsupportedContent.push(child);
				}
			});

			return targetItemNodeType.create({}, inlineContent);
		}

		const transformedContent: PMNode[] = [];

		if (isSourceTaskItem) {
			transformedContent.push(paragraphType.create(null, itemNode.content));
		} else {
			itemNode.forEach((child) => {
				if (isListWithIndentation(child.type.name, schema)) {
					if (excludeNestedLists) {
						// Skip nested lists - they will be handled separately as siblings
						return;
					}
					transformedContent.push(
						transformList(child, targetListType, targetItemType, unsupportedContent),
					);
				} else {
					transformedContent.push(child);
				}
			});
		}

		if (transformedContent.length === 0) {
			transformedContent.push(paragraphType.create());
		}

		return targetItemNodeType.create({}, transformedContent);
	};

	const convertList = (
		node: PMNode,
		schema: Schema,
		targetListType: string,
		targetItemType: string,
	): PMNode => {
		const targetListNodeType = schema.nodes[targetListType];
		const transformedContent: PMNode[] = [];

		node.forEach((childNode) => {
			const transformedItem = isListWithIndentation(childNode.type.name, schema)
				? transformList(childNode, targetListType, targetItemType, unsupportedContent)
				: transformListItem(childNode, targetListType, targetItemType);

			if (transformedItem) {
				transformedContent.push(transformedItem);
			}
		});

		return targetListNodeType.create(node.attrs, transformedContent);
	};

	if (isSourceTaskList && !isTargetTaskList) {
		return convertFromTaskListStructure(node, targetListType, targetItemType);
	} else if (!isSourceTaskList && isTargetTaskList) {
		return convertToTaskListStructure(node, targetListType, targetItemType);
	}

	return convertList(node, schema, targetListType, targetItemType);
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
export const listToListStep: TransformStep = (nodes: PMNode[], context: TransformStepContext) => {
	const { schema, targetNodeTypeName } = context;
	const unsupportedContent: PMNode[] = [];

	const transformedNodes = nodes.map((node) => {
		if (isListWithIndentation(node.type.name, schema)) {
			const targetItemType = targetNodeTypeName === 'taskList' ? 'taskItem' : 'listItem';

			return transformList(node, targetNodeTypeName, targetItemType, unsupportedContent);
		}

		return node;
	});

	return [...transformedNodes, ...unsupportedContent];
};
