import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import { transformListStructure } from './list/transformBetweenListTypes';
import type { TransformContext, TransformFunction } from './types';
import { isBlockNodeType, isContainerNodeType, isListNodeType } from './utils';

/**
 * Transform selection to list type
 */
export const transformBlockToList = (context: TransformContext): Transaction | null => {
	const { tr, targetNodeType, targetAttrs } = context;
	const { $from, $to } = tr.selection;
	const range = $from.blockRange($to);

	if (!range) {
		return null;
	}

	const { nodes } = tr.doc.type.schema;
	const isTargetTask = targetNodeType === nodes.taskList;

	// Handle task lists differently due to their structure
	// TODO: ED-29152 - Implement task list transformation
	if (isTargetTask) {
		return null;
	}

	// For headings, convert to paragraph first since headings cannot be direct children of list items
	const sourceNode = tr.doc.nodeAt(range.start);
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
 * Transform list nodes
 */
export const transformListNode: TransformFunction = (context: TransformContext) => {
	const { targetNodeType } = context;
	// Transform list to block type
	if (isBlockNodeType(targetNodeType)) {
		// Lift list items out of the list and convert to target block type
		return null;
	}

	// Transform list to container type
	if (isContainerNodeType(targetNodeType)) {
		// Lift list items out of the list and convert to container type
		return null;
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
export const transformBetweenListTypes = ({ tr, targetNodeType }: TransformContext) => {
	const { selection } = tr;
	const { nodes } = tr.doc.type.schema;

	// Find the list node - support bullet lists, ordered lists, and task lists
	const supportedListTypes = [nodes.bulletList, nodes.orderedList, nodes.taskList].filter(Boolean); // Filter out undefined nodes in case some schemas don't have all types

	const listNode = findParentNodeOfType(supportedListTypes)(selection);

	if (!listNode) {
		return null;
	}

	const sourceListType = listNode.node.type;
	const isSourceBulletOrOrdered =
		sourceListType === nodes.bulletList || sourceListType === nodes.orderedList;
	const isTargetTask = targetNodeType === nodes.taskList;
	const isSourceTask = sourceListType === nodes.taskList;
	const isTargetBulletOrOrdered =
		targetNodeType === nodes.bulletList || targetNodeType === nodes.orderedList;

	// Check if we need structure transformation
	const needsStructureTransform =
		(isSourceBulletOrOrdered && isTargetTask) || (isSourceTask && isTargetBulletOrOrdered);
	try {
		if (!needsStructureTransform) {
			// Simple type change for same structure lists (bullet <-> ordered)
			tr.setNodeMarkup(listNode.pos, targetNodeType);
		} else {
			tr = transformListStructure(tr, listNode, targetNodeType, nodes);
		}
	} catch {
		return null;
	}

	return tr;
};
