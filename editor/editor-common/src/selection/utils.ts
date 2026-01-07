import type {
	NodeRange,
	Node as PMNode,
	ResolvedPos,
	Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';

import { GapCursorSelection } from './gap-cursor/selection';

export const isSelectionAtStartOfNode = ($pos: ResolvedPos, parentNode?: PMNode): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode)) {
			break;
		}

		if (i > 1 && $pos.before(i) !== $pos.before(i - 1) + 1) {
			return false;
		}
	}

	return true;
};

export const isSelectionAtEndOfNode = ($pos: ResolvedPos, parentNode?: PMNode): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode)) {
			break;
		}

		if (i > 1 && $pos.after(i) !== $pos.after(i - 1) - 1) {
			return false;
		}
	}

	return true;
};

export function atTheEndOfDoc(state: EditorState): boolean {
	const { selection, doc } = state;
	return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}

export function atTheBeginningOfDoc(state: EditorState): boolean {
	const { selection } = state;
	return selection.$from.pos === selection.$from.depth;
}

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

export function startPositionOfParent(resolvedPos: ResolvedPos): number {
	return resolvedPos.start(resolvedPos.depth);
}

export function endPositionOfParent(resolvedPos: ResolvedPos): number {
	return resolvedPos.end(resolvedPos.depth) + 1;
}

/**
 *
 * @param $anchor Resolved selection anchor position
 * @param $head Resolved selection head position
 * @returns An expanded selection encompassing surrounding nodes. Hoists up to the shared depth anchor/head depths differ.
 */
export const expandSelectionBounds = (
	$anchor: ResolvedPos,
	$head: ResolvedPos,
): { $anchor: ResolvedPos; $head: ResolvedPos } => {
	const sharedDepth = $anchor.sharedDepth($head.pos) + 1;
	const $from = $anchor.min($head);
	const $to = $anchor.max($head);
	const fromDepth = $from.depth;
	const toDepth = $to.depth;

	let selectionStart: number;
	let selectionEnd: number;

	const selectionHasGrandparent = toDepth > 1 && fromDepth > 1;
	const selectionIsAcrossDiffParents =
		selectionHasGrandparent && !$to.parent.isTextblock && !$to.sameParent($from);
	const selectionIsAcrossTextBlocksWithDiffParents =
		selectionHasGrandparent &&
		$to.parent.isTextblock &&
		$to.before(toDepth - 1) !== $from.before(fromDepth - 1);

	if (toDepth > fromDepth) {
		selectionStart = $from.before(sharedDepth);
		selectionEnd = $to.after(sharedDepth);
	} else if (toDepth < fromDepth) {
		selectionStart = $from.before(sharedDepth);
		selectionEnd = $to.after(sharedDepth);
	} else if (selectionIsAcrossDiffParents || selectionIsAcrossTextBlocksWithDiffParents) {
		// when selection from/to share same depth with different parents, hoist up the selection to the parent of the highest depth in the selection
		selectionStart = $from.before(sharedDepth);
		selectionEnd = $to.after(sharedDepth);
	} else if (!$from.node().inlineContent) {
		// when selection might be a Node selection, return what was passed in
		return { $anchor, $head };
	} else {
		selectionStart = fromDepth ? $from.before() : $from.pos;
		selectionEnd = toDepth ? $to.after() : $to.pos;
	}

	const $expandedFrom = $anchor.doc.resolve(selectionStart);
	const $expandedTo = $anchor.doc.resolve(selectionEnd);

	return {
		$anchor: $anchor === $from ? $expandedFrom : $expandedTo,
		$head: $head === $to ? $expandedTo : $expandedFrom,
	};
};

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
) => {
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
export const expandSelectionToBlockRange = ({ $from, $to }: Selection) => {
	return expandToBlockRange($from, $to);
};

export const isMultiBlockRange = (range: NodeRange): boolean => {
	if (range.endIndex - range.startIndex <= 1) {
		return false; // At most one child
	}

	// Count block nodes in the range, return true if more than one
	let blockCount = 0;
	for (let i = range.startIndex; i < range.endIndex; i++) {
		if (range.parent.child(i).isBlock) {
			blockCount++;
		}
		if (blockCount > 1) {
			return true;
		}
	}

	return false;
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
