import type {
	NodeRange,
	Node as PMNode,
	ResolvedPos,
	Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';

import { isListNode } from '../utils';

import { endPositionOfParent } from './endPositionOfParent';
import { GapCursorSelection } from './gap-cursor/selection';
import { isMultiBlockRange } from './isMultiBlockRange';
import { startPositionOfParent } from './startPositionOfParent';

export function atTheEndOfBlock(state: EditorState): boolean {
	const { selection } = state;
	const { $to } = selection;
	if (selection instanceof GapCursorSelection) {
		return false;
	}
	if (selection instanceof NodeSelection && selection.node.isBlock) {
		return true;
	}
	return endPositionOfParent($to) === $to.pos + 1;
}

export function atTheBeginningOfBlock(state: EditorState): boolean {
	const { selection } = state;
	return selectionIsAtTheBeginningOfBlock(selection);
}

export function selectionIsAtTheBeginningOfBlock(selection: Selection): boolean {
	const { $from } = selection;
	if (selection instanceof GapCursorSelection) {
		return false;
	}
	if (selection instanceof NodeSelection && selection.node.isBlock) {
		return true;
	}
	return startPositionOfParent($from) === $from.pos;
}

/**
 * Delete what is selected in the given transaction.
 * @param tr the transaction to delete the selection from
 * @param selectionToUse optional selection to delete instead of the transaction's current selection
 * @returns the updated transaction
 */
export const deleteSelectedRange = (tr: Transaction, selectionToUse?: Selection): Transaction => {
	const selection = selectionToUse || tr.selection;
	let from = selection.$from.pos;
	let to = selection.$to.pos;

	if (selection instanceof TextSelection) {
		// Expand just the from position to the start of the block
		// This ensures entire paragraphs are deleted instead of just
		// the text content, which avoids leaving an empty line behind
		const expanded = expandToBlockRange(selection.$from, selection.$to);
		from = expanded.$from.pos;
	} else if (isTableSelected(selection)) {
		const table = findTable(selection);
		if (table) {
			from = table.pos;
			to = table.pos + table.node.nodeSize;
		}
	}

	tr.deleteRange(from, to);

	return tr;
};

const getDefaultPredicate = ({ nodes }: Schema) => {
	const requiresFurtherExpansion = new Set([
		nodes.bulletList,
		nodes.orderedList,
		nodes.taskList,
		nodes.listItem,
		nodes.taskItem,

		nodes.tableHeader,
		nodes.tableRow,
		nodes.tableCell,
		nodes.table,

		nodes.mediaGroup,
		nodes.mediaSingle,
	]);

	return (node: PMNode) => !requiresFurtherExpansion.has(node.type);
};

/**
 * This expands the given $from and $to resolved positions to the block boundaries
 * spanning all nodes in the range up to the nearest common ancestor.
 *
 * By default, it will further expand the range when encountering specific node types
 * that require full block selection (like lists and tables). A custom predicate
 * can be provided to modify this behavior.
 *
 * @param $from The resolved start position
 * @param $to The resolved end position
 * @param predicate A predicate to determine if parent node is acceptable (see prosemirror-model/blockRange)
 * @returns An object containing the expanded $from and $to resolved positions
 */
export const expandToBlockRange = (
	$from: ResolvedPos,
	$to: ResolvedPos,
	predicate: (node: PMNode) => boolean = getDefaultPredicate($from.doc.type.schema),
):
	| {
			$from: ResolvedPos;
			$to: ResolvedPos;
			range?: undefined;
	  }
	| {
			$from: ResolvedPos;
			$to: ResolvedPos;
			range: NodeRange;
	  } => {
	const range = $from.blockRange($to, predicate);

	if (!range) {
		return { $from, $to };
	}

	return {
		$from: $from.doc.resolve(range.start),
		$to: $to.doc.resolve(range.end),
		range,
	};
};

/**
 * Expands a given selection to a block range, considering specific node types that require expansion.
 *
 * E.g. if the selection starts/ends at list items or table cells, the selection will be expanded
 * to encompass the entire list or table.
 *
 * Used mostly for block menu / drag handle related selections, where we want to ensure the selection
 * being acted upon covers the entire block range selected by the user.
 *
 * @param selection The selection to expand
 * @returns The expanded selection
 */
export const expandSelectionToBlockRange = ({
	$from,
	$to,
}: Selection):
	| {
			$from: ResolvedPos;
			$to: ResolvedPos;
			range?: undefined;
	  }
	| {
			$from: ResolvedPos;
			$to: ResolvedPos;
			range: NodeRange;
	  } => {
	return expandToBlockRange($from, $to);
};

/**
 * Determines if a selection contains multiple block nodes.
 */
export function isMultiBlockSelection(selection: Selection): boolean {
	const { range } = expandSelectionToBlockRange(selection);
	if (!range) {
		return false;
	}
	return isMultiBlockRange(range);
}

/**
 * Extracts the source nodes from a selection range.
 *
 * This function expands the given selection to its block range boundaries and returns
 * an array of the nodes contained within that range. It handles special cases like
 * list nodes, where the slice positions are adjusted to include the list wrapper.
 *
 * @param tr - The transaction containing the document
 * @param selection - The selection to extract nodes from
 * @returns An array of ProseMirror nodes within the expanded selection range
 *
 * @example
 * ```typescript
 * const selection = tr.selection;
 * const nodes = getSourceNodesFromSelectionRange(tr, selection);
 * // nodes will contain all block-level nodes in the selection
 * ```
 */
export function getSourceNodesFromSelectionRange(tr: Transaction, selection: Selection): PMNode[] {
	const { $from, $to } = expandSelectionToBlockRange(selection);

	const selectedParent = $from.parent;
	const isList = isListNode(selectedParent);

	const sliceStart = isList ? $from.pos - 1 : $from.pos;
	const sliceEnd = isList ? $to.pos + 1 : $to.pos;
	const slice = tr.doc.slice(sliceStart, sliceEnd);

	return [...slice.content.content];
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isSelectionAtStartOfNode } from './isSelectionAtStartOfNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isSelectionAtEndOfNode } from './isSelectionAtEndOfNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { atTheEndOfDoc } from './atTheEndOfDoc';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { atTheBeginningOfDoc } from './atTheBeginningOfDoc';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { startPositionOfParent } from './startPositionOfParent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { endPositionOfParent } from './endPositionOfParent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { expandSelectionBounds } from './expandSelectionBounds';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isMultiBlockRange } from './isMultiBlockRange';
