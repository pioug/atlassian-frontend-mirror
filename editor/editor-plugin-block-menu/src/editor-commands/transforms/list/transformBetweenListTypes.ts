import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import type { TransformContext } from '../types';
import { getSupportedListTypesSet, isBulletOrOrderedList, isTaskList } from '../utils';

/**
 * Convert a block node to inline content suitable for task items
 */
const convertBlockToInlineContent = (node: PMNode, schema: Schema): PMNode[] => {
	const { paragraph } = schema.nodes;

	if (node.type === paragraph) {
		return [...node.content.content];
	}

	if (node.isBlock) {
		const textContent = node.textContent;
		return textContent ? [schema.text(textContent)] : [];
	}

	return [node];
};

type TransformListRecursivelyProps = {
	isSourceBulletOrOrdered: boolean;
	isSourceTask: boolean;
	isTargetBulletOrOrdered: boolean;
	isTargetTask: boolean;
	listNode: PMNode;
	schema: Schema;
	supportedListTypes: Set<NodeType>;
	targetNodeType: NodeType;
};

export const transformListRecursively = (props: TransformListRecursivelyProps): PMNode => {
	const transformedItems: PMNode[] = [];
	const {
		listNode,
		isSourceBulletOrOrdered,
		isTargetBulletOrOrdered,
		isSourceTask,
		isTargetTask,
		supportedListTypes,
		schema,
		targetNodeType,
	} = props;
	const { taskList, listItem, taskItem, paragraph } = schema.nodes;

	listNode.forEach((child) => {
		if (isSourceBulletOrOrdered && isTargetTask) {
			// Convert bullet/ordered => task
			if (child.type === listItem) {
				const inlineContent: PMNode[] = [];
				const nestedTaskLists: PMNode[] = [];

				child.forEach((grandChild) => {
					if (supportedListTypes.has(grandChild.type) && grandChild.type !== taskList) {
						nestedTaskLists.push(transformListRecursively({ ...props, listNode: grandChild }));
					} else {
						inlineContent.push(...convertBlockToInlineContent(grandChild, schema));
					}
				});

				if (inlineContent.length > 0) {
					transformedItems.push(taskItem.create(null, inlineContent));
				}
				transformedItems.push(...nestedTaskLists);
			}
		} else if (isSourceTask && isTargetBulletOrOrdered) {
			// Convert task => bullet/ordered
			if (child.type === taskItem) {
				const inlineContent = [...child.content.content];
				if (inlineContent.length > 0) {
					const paragraphNode = paragraph.create(null, inlineContent);
					transformedItems.push(listItem.create(null, [paragraphNode]));
				}
			} else if (child.type === taskList) {
				const transformedNestedList = transformListRecursively({ ...props, listNode: child });
				const lastItem = transformedItems[transformedItems.length - 1];

				if (lastItem?.type === listItem) {
					// Attach nested list to previous item
					const updatedContent = [...lastItem.content.content, transformedNestedList];
					transformedItems[transformedItems.length - 1] = listItem.create(
						lastItem.attrs,
						updatedContent,
					);
				} else {
					// No previous item, flatten nested items
					transformedItems.push(...transformedNestedList.content.content);
				}
			}
		} else if (isSourceBulletOrOrdered && isTargetBulletOrOrdered) {
			if (child.type === listItem) {
				const convertedNestedLists: PMNode[] = [];
				child.forEach((grandChild) => {
					if (supportedListTypes.has(grandChild.type) && grandChild.type !== targetNodeType) {
						const convertedNode = transformListRecursively({
							...props,
							listNode: grandChild,
						});
						convertedNestedLists.push(convertedNode);
					} else {
						convertedNestedLists.push(grandChild);
					}
				});
				transformedItems.push(listItem.create(null, convertedNestedLists));
			}
		}
	});

	return targetNodeType.create(null, transformedItems);
};

/**
 * Transform list structure between different list types
 */
export const transformListStructure = (context: TransformContext) => {
	const { tr, sourceNode, sourcePos, targetNodeType } = context;
	const nodes = tr.doc.type.schema.nodes;

	try {
		const listNode = { node: sourceNode, pos: sourcePos };
		const { node: sourceList, pos: listPos } = listNode;
		// const { taskList, listItem, taskItem, paragraph } = nodes;

		const isSourceBulletOrOrdered = isBulletOrOrderedList(sourceList.type);
		const isTargetTask = isTaskList(targetNodeType);
		const isSourceTask = isTaskList(sourceList.type);
		const isTargetBulletOrOrdered = isBulletOrOrderedList(targetNodeType);

		const supportedListTypes = getSupportedListTypesSet(nodes);

		const newList = transformListRecursively({
			isSourceBulletOrOrdered,
			isSourceTask,
			isTargetBulletOrOrdered,
			isTargetTask,
			listNode: sourceList,
			schema: tr.doc.type.schema,
			supportedListTypes,
			targetNodeType,
		});

		tr.replaceWith(listPos, listPos + sourceList.nodeSize, newList);
		return tr;
	} catch {
		return tr;
	}
};
