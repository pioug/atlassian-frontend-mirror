import type { Mark, NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	findChildrenByType,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { mapSlice } from '../utils/slice';

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

export const createBlockTaskItem = ({
	attrs,
	content,
	marks,
	schema,
}: {
	attrs?: Record<string, unknown> | null;
	content: PMNode[] | Fragment;
	marks?: readonly Mark[];
	schema: Schema;
}): PMNode => {
	const { blockTaskItem, paragraph } = schema.nodes;

	const newParagraph = paragraph.createChecked(
		null,
		content,
		marks?.filter((mark) => blockTaskItem.allowsMarkType(mark.type)),
	);

	return blockTaskItem.create(attrs ?? null, newParagraph);
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
	const { taskList, listItem, taskItem, paragraph, blockTaskItem } = schema.nodes;

	// gating behind platform_editor_small_font_size to support task lists with font size applied,
	// but keep this solution general
	const isBlockTaskEnabled =
		!!blockTaskItem && expValEquals('platform_editor_small_font_size', 'isEnabled', true);

	/**
	 * Extracts paragraph children from a blockTaskItem, preserving their marks.
	 */
	const extractParagraphsFromBlockTaskItem = (node: PMNode): PMNode[] => {
		const paragraphs: PMNode[] = [];
		node.forEach((child) => {
			if (child.type === paragraph) {
				paragraphs.push(child);
			}
		});
		return paragraphs;
	};

	listNode.forEach((child) => {
		if (isSourceBulletOrOrdered && isTargetTask) {
			// Convert bullet/ordered => task
			if (child.type === listItem) {
				const inlineContent: PMNode[] = [];
				const nestedTaskLists: PMNode[] = [];
				let blockMarks: readonly Mark[] = [];

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
						if (
							isBlockTaskEnabled &&
							grandChild.type === paragraph &&
							grandChild.marks.length > 0
						) {
							blockMarks = grandChild.marks;
						}
						inlineContent.push(...convertBlockToInlineContent(grandChild, schema));
					}
				});

				if (isBlockTaskEnabled && blockMarks.length > 0) {
					transformedItems.push(
						createBlockTaskItem({ content: inlineContent, marks: blockMarks, schema }),
					);
				} else {
					transformedItems.push(
						taskItem.create(null, inlineContent.length > 0 ? inlineContent : null),
					);
				}

				transformedItems.push(...nestedTaskLists);
			}
		} else if (isSourceTask && isTargetBulletOrOrdered) {
			// Convert task => bullet/ordered
			if (child.type === taskItem) {
				const inlineContent = [...child.content.content];

				// Transfer taskItem's block marks to the paragraph.
				// Use listItem.allowsMarkType since the paragraph will be inside a listItem
				// (which uses ParagraphWithFontSizeStage0 that allows fontSize).
				const paragraphMarks =
					isBlockTaskEnabled && child.marks.length > 0
						? child.marks.filter((mark) => listItem.allowsMarkType(mark.type))
						: undefined;

				const paragraphNode = paragraph.create(
					null,
					inlineContent.length > 0 ? inlineContent : null,
					paragraphMarks,
				);
				transformedItems.push(listItem.create(null, [paragraphNode]));
			} else if (isBlockTaskEnabled && child.type === blockTaskItem) {
				// blockTaskItem wraps content in paragraphs — extract them directly,
				// preserving their fontSize marks
				const paragraphs = extractParagraphsFromBlockTaskItem(child);
				if (paragraphs.length > 0) {
					transformedItems.push(listItem.create(null, paragraphs));
				}
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
export const transformListStructure = (context: TransformContext): Transaction => {
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
export const transformBetweenListTypes = (context: TransformContext): Transaction | null => {
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
		const { taskItem, paragraph, blockTaskItem } = nodes;
		// gating behind platform_editor_small_font_size to support task lists with font size applied,
		// but keep this solution general
		const isBlockTaskItemEnabled =
			!!blockTaskItem && expValEquals('platform_editor_small_font_size', 'isEnabled', true);

		const listItems: PMNode[] = [];

		// Process each block in the range
		tr.doc.nodesBetween(range.start, range.end, (node) => {
			if (node.isBlock) {
				const inlineContent = [...node.content.content];

				if (inlineContent.length > 0) {
					if (isBlockTaskItemEnabled && node.type === paragraph && node.marks.length > 0) {
						listItems.push(
							createBlockTaskItem({
								attrs: targetAttrs,
								content: inlineContent,
								marks: node.marks,
								schema: tr.doc.type.schema,
							}),
						);
					} else {
						listItems.push(taskItem.create(targetAttrs, inlineContent));
					}
				}
			}

			return false;
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
	const { blockTaskItem } = schema.nodes;

	// gating behind platform_editor_small_font_size to support task lists with font size applied,
	// but keep this solution general
	const isBlockTaskItemEnabled =
		!!blockTaskItem && expValEquals('platform_editor_small_font_size', 'isEnabled', true);

	if (isBlockTaskItemEnabled) {
		const blockTaskItemsResult = findChildrenByType(sourceNode, blockTaskItem);

		if (blockTaskItemsResult.length > 0 && targetNodeType === schema.nodes.paragraph) {
			// blockTaskItem content is (paragraph | extension)+
			// Extract paragraph children directly — they may carry block marks (e.g. fontSize)
			const targetNodes: PMNode[] = [];
			for (const { node: blockItem } of blockTaskItemsResult) {
				blockItem.forEach((child) => {
					if (child.type === schema.nodes.paragraph) {
						targetNodes.push(child);
					}
				});
			}

			if (targetNodes.length === 0) {
				return null;
			}

			const slice = new Slice(Fragment.fromArray(targetNodes), 0, 0);
			const rangeStart = sourcePos !== null ? sourcePos : selection.from;
			tr.replaceRange(rangeStart, rangeStart + sourceNode.nodeSize, slice);
			return tr;
		}
	}

	// Original logic for regular taskItem children
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

	// gating behind platform_editor_small_font_size to support task lists with font size applied,
	// but keep this solution general
	const isBlockTaskItemEnabled =
		!!nodes.blockTaskItem && expValEquals('platform_editor_small_font_size', 'isEnabled', true);

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
		const parentNodeTypes = [
			nodes.blockquote,
			nodes.panel,
			nodes.expand,
			nodes.codeBlock,
			nodes.listItem,
			nodes.taskItem,
			nodes.layoutSection,
		];

		if (isBlockTaskItemEnabled) {
			parentNodeTypes.push(nodes.blockTaskItem);
		}

		const parentNode = findParentNodeOfType(parentNodeTypes)(selection);

		if (parentNode) {
			nodeToFormat = parentNode.node;
			nodePos = parentNode.pos;

			const paragraphOrHeadingNode = findParentNodeOfType([nodes.paragraph, nodes.heading])(
				selection,
			);
			// Special case: if we found a listItem/taskItem/blockTaskItem, check if we need the parent list instead
			if (
				parentNode.node.type === nodes.listItem ||
				parentNode.node.type === nodes.taskItem ||
				(isBlockTaskItemEnabled && parentNode.node.type === nodes.blockTaskItem)
			) {
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

/**
 * Ensures every `listItem` in a slice starts with a paragraph.
 *
 * @param slice - The slice to transform
 * @param schema - The editor schema, used to create new paragraph nodes
 * @returns A new slice with the transformation applied
 */
export const transformSliceEnsureListItemParagraphFirst = (slice: Slice, schema: Schema): Slice => {
	const { listItem, paragraph } = schema.nodes;
	if (!listItem || !paragraph) {
		return slice;
	}

	return mapSlice(slice, (node) => {
		if (node.type === listItem) {
			const firstChild = node.firstChild;
			if (firstChild && firstChild.type !== paragraph) {
				const emptyParagraph = paragraph.createAndFill();
				if (emptyParagraph) {
					const children: Array<typeof emptyParagraph> = [emptyParagraph];
					for (let i = 0; i < node.childCount; i++) {
						children.push(node.child(i));
					}
					return node.copy(Fragment.from(children));
				}
			}
		}
		return node;
	});
};
