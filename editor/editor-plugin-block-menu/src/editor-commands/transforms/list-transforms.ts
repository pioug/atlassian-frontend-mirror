import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import type { TransformContext, TransformFunction } from './types';
import { isBlockNodeType, isContainerNodeType, isListNodeType } from './utils';

/**
 * Transform selection to list type
 */
export const transformToList = ({
	tr,
	targetNodeType,
	targetAttrs,
}: {
	targetAttrs?: Record<string, unknown>;
	targetNodeType: NodeType;
	tr: Transaction;
}): Transaction | null => {
	// Wrap selection in list of target type
	const { $from, $to } = tr.selection;
	const range = $from.blockRange($to);

	if (!range) {
		return null;
	}

	// Find if we can wrap the selection in the target list type
	const wrapping = findWrapping(range, targetNodeType, targetAttrs);
	if (!wrapping) {
		return null;
	}

	tr.wrap(range, wrapping);
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

	// Find the list node
	const listNode = findParentNodeOfType([nodes.bulletList, nodes.orderedList, nodes.taskList])(
		selection,
	);

	if (!listNode) {
		return null;
	}

	try {
		// Change the list type while preserving content
		tr.setNodeMarkup(listNode.pos, targetNodeType);
		return tr;
	} catch (e) {
		return null;
	}
};
