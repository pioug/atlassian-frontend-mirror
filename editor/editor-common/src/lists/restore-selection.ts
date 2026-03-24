import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

import { GapCursorSelection } from '../selection';

import type { FlattenedItem } from './flatten-list';

interface ComputeSelectionOffsetsOptions {
	contentStartOffsets: number[];
	docSize: number;
	endIndex: number;
	items: FlattenedItem[];
	originalFrom: number;
	originalTo: number;
	rootListStart: number;
	startIndex: number;
}

interface RestoreSelectionOptions {
	from: number;
	originalSelection: Selection;
	to: number;
	tr: Transaction;
}

/**
 * Compute the new selection offsets after list items have been moved/indented/outdented.
 *
 * Uses the content start offsets computed during fragment rebuild to map each
 * selection endpoint to its new absolute position, accounting for the change
 * in the list structure.
 */
export function computeSelectionOffsets({
	items,
	startIndex,
	endIndex,
	originalFrom,
	originalTo,
	contentStartOffsets,
	rootListStart,
	docSize,
}: ComputeSelectionOffsetsOptions): { from: number; to: number } {
	// +1 shifts from the outer edge of the list item node to the start of the content within
	const fromContentStart = items[startIndex].pos + 1;
	const toContentStart = items[endIndex].pos + 1;
	const fromOffset = originalFrom - fromContentStart;
	const toOffset = originalTo - toContentStart;

	const clamp = (pos: number) => Math.min(Math.max(0, pos), docSize);

	return {
		from: clamp(rootListStart + contentStartOffsets[startIndex] + fromOffset),
		to: clamp(rootListStart + contentStartOffsets[endIndex] + toOffset),
	};
}

/**
 * Restore the transaction's selection after a list structural change
 * (indent/outdent of list items or task list items).
 *
 * Uses the content start offsets computed during fragment rebuild to
 * map each selection endpoint to its new absolute position.
 *
 * Handles NodeSelection, GapCursorSelection, and TextSelection.
 */
export function restoreSelection({
	tr,
	originalSelection,
	from,
	to,
}: RestoreSelectionOptions): void {
	const maxPos = tr.doc.content.size;

	if (originalSelection instanceof NodeSelection) {
		try {
			tr.setSelection(NodeSelection.create(tr.doc, Math.min(from, maxPos - 1)));
		} catch {
			tr.setSelection(Selection.near(tr.doc.resolve(from)));
		}
	} else if (originalSelection instanceof GapCursorSelection) {
		tr.setSelection(new GapCursorSelection(tr.doc.resolve(from), originalSelection.side));
	} else {
		tr.setSelection(TextSelection.create(tr.doc, from, to));
	}
}
