import { NodeSelection, TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';

import type { FormatNodeTargetType } from './transforms/types';

/**
 * Sets the appropriate selection after transforming a node to a target type
 * @param newTr - The transaction containing the transformed node
 * @param nodePos - The position of the transformed node
 * @param targetType - The target type the node was transformed to
 * @returns The transaction with the updated selection, or the original transaction if no selection change needed
 */
export const setSelectionAfterTransform = (
	newTr: Transaction,
	nodePos: number,
	targetType: FormatNodeTargetType,
): Transaction => {
	// Find the actual node that was transformed to get its positioning
	const transformedNodePos = newTr.doc.resolve(nodePos);
	const transformedNode = transformedNodePos.nodeAfter;

	if (!transformedNode) {
		return newTr;
	}

	// Check if target type is other than list, text, heading, blockquotes
	const isListNode =
		targetType === 'bulletList' || targetType === 'orderedList' || targetType === 'taskList';
	const isBlockquote = targetType === 'blockquote';
	const isContainer = ['panel', 'expand', 'codeBlock', 'layoutSection'].includes(targetType);

	if (isListNode || isBlockquote) {
		// For taskList, select all content within the list
		const textStart = transformedNodePos.pos + 1; // Inside the taskList
		const textEnd = transformedNodePos.pos + transformedNode.nodeSize - 1; // End of taskList content
		const textSelection = TextSelection.between(
			newTr.doc.resolve(textStart),
			newTr.doc.resolve(textEnd),
		);
		return newTr.setSelection(textSelection);
	} else if (isContainer) {
		// Use NodeSelection for types other than list, text, heading, blockquotes
		const nodeSelection = NodeSelection.create(newTr.doc, transformedNodePos.pos);
		return newTr.setSelection(nodeSelection);
	}

	return newTr;
};
