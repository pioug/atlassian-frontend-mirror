import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	findChildrenByType,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';

import type { TransformContext } from './list-types';
import {
	getSupportedListTypesSet,
	isBulletOrOrderedList,
	isTaskList,
	convertBlockToInlineContent,
} from './list-utils';

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

const getContentSupportChecker = (targetNodeType: NodeType): ((node: PMNode) => boolean) => {
	return (node: PMNode): boolean => {
		try {
			return targetNodeType.validContent(Fragment.from(node));
		} catch {
			return false;
		}
	};
};

export const transformListRecursively = (
	props: TransformListRecursivelyProps,
	onhandleUnsupportedContent?: (content: PMNode) => void,
): PMNode => {
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
						nestedTaskLists.push(
							transformListRecursively(
								{ ...props, listNode: grandChild },
								onhandleUnsupportedContent,
							),
						);
					} else if (!getContentSupportChecker(taskItem)(grandChild) && !grandChild.isTextblock) {
						onhandleUnsupportedContent?.(grandChild);
					} else {
						inlineContent.push(...convertBlockToInlineContent(grandChild, schema));
					}
				});

				transformedItems.push(
					taskItem.create(null, inlineContent.length > 0 ? inlineContent : null),
				);
				transformedItems.push(...nestedTaskLists);
			}
		} else if (isSourceTask && isTargetBulletOrOrdered) {
			// Convert task => bullet/ordered
			if (child.type === taskItem) {
				const inlineContent = [...child.content.content];
				const paragraphNode = paragraph.create(
					null,
					inlineContent.length > 0 ? inlineContent : null,
				);
				transformedItems.push(listItem.create(null, [paragraphNode]));
			} else if (child.type === taskList) {
				const transformedNestedList = transformListRecursively(
					{ ...props, listNode: child },
					onhandleUnsupportedContent,
				);
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
						const convertedNode = transformListRecursively(
							{
								...props,
								listNode: grandChild,
							},
							onhandleUnsupportedContent,
						);
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
	const unsupportedContent: PMNode[] = [];

	const onhandleUnsupportedContent = (content: PMNode) => {
		unsupportedContent.push(content);
	};

	try {
		const listNode = { node: sourceNode, pos: sourcePos };
		const { node: sourceList, pos: listPos } = listNode;
		// const { taskList, listItem, taskItem, paragraph } = nodes;

		const isSourceBulletOrOrdered = isBulletOrOrderedList(sourceList.type);
		const isTargetTask = isTaskList(targetNodeType);
		const isSourceTask = isTaskList(sourceList.type);
		const isTargetBulletOrOrdered = isBulletOrOrderedList(targetNodeType);

		const supportedListTypes = getSupportedListTypesSet(nodes);

		const newList = transformListRecursively(
			{
				isSourceBulletOrOrdered,
				isSourceTask,
				isTargetBulletOrOrdered,
				isTargetTask,
				listNode: sourceList,
				schema: tr.doc.type.schema,
				supportedListTypes,
				targetNodeType,
			},
			onhandleUnsupportedContent,
		);

		tr.replaceWith(listPos, listPos + sourceList.nodeSize, [newList, ...unsupportedContent]);
		return tr;
	} catch {
		return tr;
	}
};

/**
 * Transform between different list types
 */
export const transformBetweenListTypes = (context: TransformContext) => {
	const { tr, sourceNode, sourcePos, targetNodeType } = context;
	const { nodes } = tr.doc.type.schema;

	const sourceListType = sourceNode.type;
	const isSourceBulletOrOrdered = isBulletOrOrderedList(sourceListType);
	const isTargetTask = isTaskList(targetNodeType);
	const isSourceTask = isTaskList(sourceListType);
	const isTargetBulletOrOrdered = isBulletOrOrderedList(targetNodeType);

	// Check if we need structure transformation
	const needsStructureTransform =
		(isSourceBulletOrOrdered && isTargetTask) || (isSourceTask && isTargetBulletOrOrdered);

	try {
		if (!needsStructureTransform) {
			// Simple type change for same structure lists (bullet <-> ordered)
			// Apply to the main list
			tr.setNodeMarkup(sourcePos, targetNodeType);

			// Apply to nested lists
			const listStart = sourcePos;
			const listEnd = sourcePos + sourceNode.nodeSize;
			const supportedListTypesSet = getSupportedListTypesSet(nodes);

			tr.doc.nodesBetween(listStart, listEnd, (node, pos, parent) => {
				// Only process nested lists (not the root list we already handled)
				if (supportedListTypesSet.has(node.type) && pos !== sourcePos) {
					const isNestedList =
						parent && (supportedListTypesSet.has(parent.type) || parent.type === nodes.listItem);

					if (isNestedList) {
						const shouldTransformNode =
							node.type === sourceListType ||
							(isBulletOrOrderedList(node.type) && isTargetBulletOrOrdered);

						if (shouldTransformNode) {
							tr.setNodeMarkup(pos, targetNodeType);
						}
					}
				}
				return true; // Continue traversing
			});
			return tr;
		} else {
			return transformListStructure(context);
		}
	} catch {
		return null;
	}
};

/**
 * Transform selection to task list
 * Handles the special structure where taskItem contains text directly (no paragraph wrapper)
 */
export const transformToTaskList = (
	tr: Transaction,
	range: { end: number; start: number },
	targetNodeType: NodeType,
	targetAttrs: Record<string, unknown> | undefined,
	nodes: Record<string, NodeType>,
): Transaction | null => {
	try {
		const { taskItem } = nodes;
		const listItems: PMNode[] = [];

		// Process each block in the range
		tr.doc.nodesBetween(range.start, range.end, (node) => {
			if (node.isBlock) {
				// For block nodes like paragraphs, directly use their inline content
				const inlineContent = [...node.content.content];

				if (inlineContent.length > 0) {
					// Create task item with inline content directly
					const listItem = taskItem.create(targetAttrs, inlineContent);
					listItems.push(listItem);
				}
			}

			return false; // Don't traverse into children
		});

		if (listItems.length === 0) {
			return null;
		}

		// Create the new task list
		const newList = targetNodeType.create(targetAttrs, listItems);

		// Replace the range with the new list
		tr.replaceWith(range.start, range.end, newList);

		return tr;
	} catch {
		return null;
	}
};

export const transformTaskListToBlockNodes = (context: TransformContext): Transaction | null => {
	const { tr, targetNodeType, targetAttrs, sourceNode, sourcePos } = context;
	const { selection } = tr;
	const schema = selection.$from.doc.type.schema;
	const taskItemsResult = findChildrenByType(sourceNode, schema.nodes.taskItem);
	const taskItems = taskItemsResult.map((item) => item.node);
	const taskItemFragments = taskItems.map((taskItem) => taskItem.content);
	let targetNodes: PMNode[] = [];

	// Convert fragments to headings if target is heading
	if (targetNodeType === schema.nodes.heading && targetAttrs) {
		// convert the fragments to headings
		const targetHeadingLevel = targetAttrs.level;
		targetNodes = taskItemFragments.map((fragment) =>
			schema.nodes.heading.createChecked({ level: targetHeadingLevel }, fragment.content),
		);
	}

	// Convert fragments to paragraphs if target is paragraphs
	if (targetNodeType === schema.nodes.paragraph) {
		// convert the fragments to paragraphs
		targetNodes = taskItemFragments.map((fragment) =>
			schema.nodes.paragraph.createChecked({}, fragment.content),
		);
	}

	// Convert fragments to code block if target is code block
	if (targetNodeType === schema.nodes.codeBlock) {
		// convert the fragments to one code block
		const codeBlockContent = taskItemFragments
			.map((fragment) => fragment.textBetween(0, fragment.size, '\n'))
			.join('\n');
		targetNodes = [schema.nodes.codeBlock.createChecked({}, schema.text(codeBlockContent))];
	}

	// Replace the task list node with the new content in the transaction
	const slice = new Slice(Fragment.fromArray(targetNodes), 0, 0);
	const rangeStart = sourcePos !== null ? sourcePos : selection.from;
	tr.replaceRange(rangeStart, rangeStart + sourceNode.nodeSize, slice);

	return tr;
};

export const getFormattedNode = (tr: Transaction): { node: PMNode; pos: number } => {
	const { selection } = tr;
	const { nodes } = tr.doc.type.schema;

	// Find the node to format from the current selection
	let nodeToFormat;
	let nodePos: number = selection.from;

	// Try to find the current node from selection
	const selectedNode = findSelectedNodeOfType([
		nodes.paragraph,
		nodes.heading,
		nodes.blockquote,
		nodes.panel,
		nodes.expand,
		nodes.codeBlock,
		nodes.bulletList,
		nodes.orderedList,
		nodes.taskList,
		nodes.layoutSection,
	])(selection);

	if (selectedNode) {
		nodeToFormat = selectedNode.node;
		nodePos = selectedNode.pos;
	} else {
		// Try to find parent node (including list parents)
		const parentNode = findParentNodeOfType([
			nodes.blockquote,
			nodes.panel,
			nodes.expand,
			nodes.codeBlock,
			nodes.listItem,
			nodes.taskItem,
			nodes.layoutSection,
		])(selection);

		if (parentNode) {
			nodeToFormat = parentNode.node;
			nodePos = parentNode.pos;

			const paragraphOrHeadingNode = findParentNodeOfType([nodes.paragraph, nodes.heading])(
				selection,
			);
			// Special case: if we found a listItem, check if we need the parent list instead
			if (parentNode.node.type === nodes.listItem || parentNode.node.type === nodes.taskItem) {
				const listParent = findParentNodeOfType([
					nodes.bulletList,
					nodes.orderedList,
					nodes.taskList,
				])(selection);

				if (listParent) {
					// For list transformations, we want the list parent, not the listItem
					nodeToFormat = listParent.node;
					nodePos = listParent.pos;
				}
			} else if (parentNode.node.type !== nodes.blockquote && paragraphOrHeadingNode) {
				nodeToFormat = paragraphOrHeadingNode.node;
				nodePos = paragraphOrHeadingNode.pos;
			}
		}
	}

	if (!nodeToFormat) {
		nodeToFormat = selection.$from.node();
		nodePos = selection.$from.pos;
	}

	return { node: nodeToFormat, pos: nodePos };
};
