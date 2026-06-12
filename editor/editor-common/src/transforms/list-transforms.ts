import type { Mark, NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { convertBlockToInlineContent } from './convertBlockToInlineContent';
import { createBlockTaskItem } from './createBlockTaskItem';
import { isBulletOrOrderedList } from './isBulletOrOrderedList';
import { isTaskList } from './isTaskList';
import type { TransformContext } from './list-types';
import { getSupportedListTypesSet } from './list-utils';
import { transformListStructure } from './transformListStructure';
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
 * Transform between different list types
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { createBlockTaskItem } from './createBlockTaskItem';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { transformListStructure } from './transformListStructure';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { transformTaskListToBlockNodes } from './transformTaskListToBlockNodes';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getFormattedNode } from './getFormattedNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { transformSliceEnsureListItemParagraphFirst } from './transformSliceEnsureListItemParagraphFirst';
