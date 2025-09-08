import { type Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';

import { transformListStructure } from './list/transformBetweenListTypes';
import { transformOrderedUnorderedListToBlockNodes } from './list/transformOrderedUnorderedListToBlockNodes';
import { transformTaskListToBlockNodes } from './list/transformTaskListToBlockNodes';
import { transformToTaskList } from './list/transformToTaskList';
import type { TransformContext, TransformFunction } from './types';
import {
	getSupportedListTypesSet,
	isBulletOrOrderedList,
	isBlockNodeType,
	isContainerNodeType,
	isListNodeType,
	isTaskList,
} from './utils';

/**
 * Transform selection to list type
 */
export const transformBlockToList = (context: TransformContext): Transaction | null => {
	const { tr, sourceNode, targetNodeType, targetAttrs } = context;
	const { $from, $to } = tr.selection;
	const schema = tr.doc.type.schema;
	const range = $from.blockRange($to);

	if (!range) {
		return null;
	}

	const { nodes } = tr.doc.type.schema;
	const isTargetTask = isTaskList(targetNodeType);

	// Handle task lists differently due to their structure
	if (isTargetTask) {
		return transformToTaskList(tr, range, targetNodeType, targetAttrs, nodes);
	}

	// filter marks that are not allowed in the target node type
	if (sourceNode.type === schema.nodes.paragraph || sourceNode.type === schema.nodes.heading) {
		const allowedMarks = targetNodeType.allowedMarks(sourceNode.marks);
		tr.setNodeMarkup(range.start, null, null, allowedMarks);
	}

	// For headings, convert to paragraph first since headings cannot be direct children of list items
	if (sourceNode && sourceNode.type.name.startsWith('heading')) {
		tr.setBlockType(range.start, range.end, nodes.paragraph);
	}

	// Get the current range (updated if we converted from heading)
	const currentRange = tr.selection.$from.blockRange(tr.selection.$to) || range;

	// Wrap in the target list type
	const wrapping = findWrapping(currentRange, targetNodeType, targetAttrs);
	if (!wrapping) {
		return null;
	}

	tr.wrap(currentRange, wrapping);
	return tr;
};

/**
 * Transform list to block nodes
 */
export const transformListToBlockNodes = (context: TransformContext): Transaction | null => {
	const { sourceNode } = context;
	if (sourceNode.type.name === 'taskList') {
		return transformTaskListToBlockNodes(context);
	} else {
		return transformOrderedUnorderedListToBlockNodes(context);
	}
};

/**
 * Wraps bulletList, orderedList or taskList in node of container type
 */
export const transformListToContainer = (context: TransformContext): Transaction | null => {
	const { tr, sourceNode, sourcePos, targetNodeType, targetAttrs } = context;

	if (sourcePos === null) {
		return null;
	}

	const { schema } = tr.doc.type;
	const { blockquote, taskList, taskItem, paragraph } = schema.nodes;

	// Special case: Task list -> Blockquote
	// Flattens the task list before wrapping by blockquote
	if (sourceNode.type === taskList && targetNodeType === blockquote) {
		const extractParagraphsFromTaskList = (node: PMNode): PMNode[] => {
			const paragraphs: PMNode[] = [];

			node.forEach((child) => {
				if (child.type === taskItem) {
					if (child.content.size > 0) {
						const paragraphNode = paragraph.createChecked({}, child.content.content);
						paragraphs.push(paragraphNode);
					}
				} else if (child.type === taskList) {
					paragraphs.push(...extractParagraphsFromTaskList(child));
				}
			});

			return paragraphs;
		};

		const liftedParagraphs = extractParagraphsFromTaskList(sourceNode);
		const containerNode = targetNodeType.createAndFill(
			targetAttrs,
			Fragment.from(liftedParagraphs),
		);

		if (!containerNode) {
			return null;
		}

		tr.replaceWith(sourcePos, sourcePos + sourceNode.nodeSize, containerNode);
		return tr;
	}

	// Default case
	const containerNode = targetNodeType.createAndFill(targetAttrs, [sourceNode]);

	if (!containerNode) {
		return null;
	}

	tr.replaceWith(sourcePos, sourcePos + sourceNode.nodeSize, containerNode);

	return tr;
};

/**
 * Transform list nodes
 */
export const transformListNode: TransformFunction = (context: TransformContext) => {
	const { targetNodeType } = context;
	// Transform list to block type
	if (isBlockNodeType(targetNodeType)) {
		// Lift list items out of the list and convert to target block type
		return transformListToBlockNodes(context);
	}

	// Transform list to container type
	if (isContainerNodeType(targetNodeType)) {
		// Wrap list items into container type, where possible
		return transformListToContainer(context);
	}

	// Transform between list types
	if (isListNodeType(targetNodeType)) {
		return transformBetweenListTypes(context);
	}

	return null;
};

/**
 * Lift list content and convert to block type
 */
export const liftListToBlockType = () => {
	// Convert to target block type directly
	return null;
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
