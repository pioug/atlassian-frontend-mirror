import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';

import { getInlineNodeTextContent } from '../inline-node-transforms';
import { transformListRecursively } from '../list/transformBetweenListTypes';
import type { TransformContext } from '../types';
import {
	getContentSupportChecker,
	getSupportedListTypesSet,
	isBlockNode,
	isBlockNodeForExtraction,
	isBlockNodeType,
	isBulletOrOrderedList,
	isContainerNode,
	isContainerNodeType,
	isHeadingOrParagraphNode,
	isListNode,
	isListNodeType,
	isTaskList,
} from '../utils';

export const unwrapLayoutNodesToTextNodes = (
	context: TransformContext,
	finalTargetNodeType: NodeType,
): PMNode[] => {
	const { tr, sourceNode, targetNodeType, targetAttrs } = context;
	const schema = tr.doc.type.schema || {};
	const isValid = getContentSupportChecker(finalTargetNodeType);

	const createTextNode = (node: PMNode): PMNode => {
		const isTextNode = node.type.name === 'text';
		if (isValid(node) && !isTextNode) {
			return node;
		}
		return targetNodeType.createChecked(targetAttrs, isTextNode ? node : node.content, node.marks);
	};

	if (isBlockNode(sourceNode)) {
		// code block acts like a container, we need to unwrap it
		if (sourceNode.type === schema.nodes.codeBlock) {
			const textNodes = sourceNode.textContent
				.split('\n')
				.map((line) => targetNodeType.createChecked(undefined, line ? schema.text(line) : null));
			return textNodes;
		}

		return [createTextNode(sourceNode)];
	}

	if (isContainerNode(sourceNode)) {
		const containerNodes: PMNode[] = [];
		if (sourceNode.type.name === 'expand' && sourceNode.attrs?.title) {
			containerNodes.push(createTextNode(schema.text(sourceNode.attrs.title)));
		}
		sourceNode.content.forEach((childNode) => {
			if (isHeadingOrParagraphNode(childNode)) {
				containerNodes.push(createTextNode(childNode));
				return;
			}
			containerNodes.push(childNode);
		});
		return containerNodes;
	}

	if (isListNode(sourceNode)) {
		if (isBlockNodeType(finalTargetNodeType)) {
			if (sourceNode.type.name === 'taskList') {
				const taskItemsResult = findChildrenByType(sourceNode, schema.nodes.taskItem);
				const taskItems = taskItemsResult.map((item) => item.node);
				const taskItemFragments = taskItems.map((taskItem) => taskItem.content);
				return taskItemFragments.map((fragment) =>
					targetNodeType.createChecked(targetAttrs, fragment.content),
				);
			} else {
				const paragraphs = findChildrenByType(sourceNode, schema.nodes.paragraph);
				const paragraphNodes = paragraphs.map((paragraph) => paragraph.node);
				if (targetNodeType === schema.nodes.heading) {
					return paragraphNodes.map((paragraphNode) =>
						targetNodeType.createChecked(targetAttrs, paragraphNode.content),
					);
				}
				return paragraphNodes;
			}
		}
		return [sourceNode];
	}
	return [sourceNode];
};

const transformToBlockNode = (
	nodes: PMNode[],
	targetNodeType: NodeType,
	schema: Schema,
): PMNode[] => {
	if (targetNodeType === schema.nodes.codeBlock) {
		const newNodes: (
			| { canBeTransformed: true; content: string[] }
			| { canBeTransformed: false; content: PMNode }
		)[] = [];
		nodes.forEach((node) => {
			if (node.isTextblock) {
				const inlineTextContent =
					node.type === schema.nodes.codeBlock
						? node.textContent
						: getInlineNodeTextContent(Fragment.from(node));

				// For first node, add directly
				if (newNodes.length === 0) {
					newNodes.push({
						canBeTransformed: true,
						content: [inlineTextContent],
					});
				} else {
					// Check if last node can also be transformed, if yes then append content
					const lastItem = newNodes[newNodes.length - 1];
					if (lastItem.canBeTransformed) {
						newNodes[newNodes.length - 1] = {
							content: [...lastItem.content, inlineTextContent],
							canBeTransformed: true,
						};
					} else {
						newNodes.push({ content: [inlineTextContent], canBeTransformed: true });
					}
				}
			} else {
				// If not text block, then cannot be transformed
				newNodes.push({ canBeTransformed: false, content: node });
			}
		});

		return newNodes
			.map(({ canBeTransformed, content }) => {
				if (canBeTransformed) {
					const text = content.join('\n');
					if (text === '') {
						return undefined;
					}
					return targetNodeType.createChecked(null, schema.text(text));
				} else {
					return content;
				}
			})
			.filter(Boolean) as PMNode[];
	}
	return nodes;
};

const transformToContainerNode = (nodes: PMNode[], targetNodeType: NodeType): PMNode[] => {
	const newNodes: (
		| { canBeTransformed: true; node: PMNode[] | readonly PMNode[] }
		| { canBeTransformed: false; node: PMNode }
	)[] = [];
	const isNodeValid = getContentSupportChecker(targetNodeType);

	nodes.forEach((node) => {
		// If the node is not supported then we append as is
		if (isBlockNodeForExtraction(node)) {
			newNodes.push({ node: node, canBeTransformed: false });
		} else {
			// Remove alignment marks as container nodes don't support them
			const nodeWithValidAttrs = node.mark(
				node.marks.filter((mark) => mark.type.name !== 'alignment'),
			);

			const isSameNodeType = node.type === targetNodeType;

			// If the node is not valid and not the same type, we cannot transform it
			if (!isNodeValid(nodeWithValidAttrs) && !isSameNodeType) {
				newNodes.push({ node: node, canBeTransformed: false });
				return;
			}

			const nodes = isSameNodeType ? node.content.content : [nodeWithValidAttrs];

			if (newNodes.length === 0) {
				newNodes.push({
					node: nodes,
					canBeTransformed: true,
				});
			} else {
				const lastItem = newNodes[newNodes.length - 1];
				if (lastItem.canBeTransformed) {
					newNodes[newNodes.length - 1] = {
						node: [...lastItem.node, ...nodes],
						canBeTransformed: true,
					};
				} else {
					newNodes.push({ node: nodes, canBeTransformed: true });
				}
			}
		}
	});
	return newNodes.map(({ node, canBeTransformed }) => {
		if (canBeTransformed) {
			return targetNodeType.createChecked(null, Fragment.fromArray(node));
		} else {
			return node;
		}
	});
};

export const transformToListNode = (
	nodes: PMNode[],
	targetNodeType: NodeType,
	schema: Schema,
): PMNode[] => {
	const isTargetTask = isTaskList(targetNodeType);

	const listItems: (
		| { canBeTransformed: false; node: PMNode }
		| { canBeTransformed: true; node: PMNode[] | readonly PMNode[] }
	)[] = [];

	const listItemType = isTargetTask ? schema.nodes.taskItem : schema.nodes.listItem;

	const isValid = getContentSupportChecker(listItemType);

	nodes.forEach((node) => {
		// Append unsupported nodes as is
		if (isBlockNodeForExtraction(node)) {
			listItems.push({ canBeTransformed: false, node });
		} else {
			let newListItems: PMNode[] | readonly PMNode[] | undefined;

			// If the node is a list, we may need to transform it
			if (isListNode(node)) {
				const isSourceBulletOrOrdered = isBulletOrOrderedList(node.type);
				const isTargetTask = isTaskList(targetNodeType);
				const isSourceTask = isTaskList(node.type);
				const isTargetBulletOrOrdered = isBulletOrOrderedList(targetNodeType);

				const supportedListTypes = getSupportedListTypesSet(schema.nodes);
				if (node.type === targetNodeType) {
					// For the same list type, we can keep the structure
					newListItems = node.content.content;
				} else {
					const newList = transformListRecursively({
						isSourceBulletOrOrdered,
						isSourceTask,
						isTargetBulletOrOrdered,
						isTargetTask,
						listNode: node,
						schema,
						supportedListTypes,
						targetNodeType,
					});
					newListItems = [...newList.content.content];
				}
			} else if (isHeadingOrParagraphNode(node) || isValid(node)) {
				if (isTargetTask) {
					const inlineContent = [...node.content.content];
					if (inlineContent.length > 0) {
						newListItems = [listItemType.create(null, inlineContent)];
					}
				} else {
					newListItems = [listItemType.create(null, node)];
				}
			} else if (!isValid(node)) {
				listItems.push({ canBeTransformed: false, node });
			}

			if (newListItems) {
				if (listItems.length === 0) {
					listItems.push({ canBeTransformed: true, node: newListItems });
				} else {
					const lastItem = listItems[listItems.length - 1];
					if (lastItem.canBeTransformed) {
						listItems[listItems.length - 1] = {
							node: [...lastItem.node, ...newListItems],
							canBeTransformed: true,
						};
					} else {
						listItems.push({ node: newListItems, canBeTransformed: true });
					}
				}
			}
		}
	});

	return listItems.map(({ node, canBeTransformed }) => {
		if (canBeTransformed) {
			return targetNodeType.createChecked(null, Fragment.fromArray(node));
		} else {
			return node;
		}
	});
};

export const convertUnwrappedLayoutContent = (
	nodes: PMNode[],
	targetNodeType: NodeType,
	schema: Schema,
): PMNode[] => {
	if (isBlockNodeType(targetNodeType)) {
		return transformToBlockNode(nodes, targetNodeType, schema);
	}
	if (isContainerNodeType(targetNodeType)) {
		return transformToContainerNode(nodes, targetNodeType);
	}

	if (isListNodeType(targetNodeType)) {
		return transformToListNode(nodes, targetNodeType, schema);
	}
	return [];
};
