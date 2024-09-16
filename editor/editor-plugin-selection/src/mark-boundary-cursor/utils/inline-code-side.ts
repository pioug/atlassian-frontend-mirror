import { type Mark } from '@atlaskit/editor-prosemirror/model';

import { MarksSide } from '../marks-side';

type GetInlineCodeCursorSideOptions = {
	leftMarks: readonly Mark[];
	rightMarks: readonly Mark[];
	storedMarks?: readonly Mark[] | null;
};

/**
 * Given the marks on the left and right side of the current selection, and the stored
 * marks being updated during a transaction, this function returns the side (-1 = left,
 * 1 = right) for which node the mark boundary cursor decoration should be added
 *
 * This is intended to correct an issue where the default cursor does not render in the
 * expected location when navigating via arrow keys past the boundary of an inline code
 * node
 */
export function getInlineCodeCursorSide({
	leftMarks,
	rightMarks,
	storedMarks,
}: GetInlineCodeCursorSideOptions): MarksSide {
	const isInlineCodeToLeft = leftMarks.some((mark) => mark.type.name === 'code');
	const isInlineCodeToRight = rightMarks.some((mark) => mark.type.name === 'code');
	const isInlineCodeBeingStored =
		!!storedMarks && storedMarks?.some((mark) => mark.type.name === 'code');
	const isStoredMarksBeingCleared = !!storedMarks && storedMarks.length === 0;

	// This condition covers two scenarios:
	// a) When the cursor is on the left side of the inline code, and is expected to be
	// positioned within the inline code after pressing arrow right
	// b) When the cursor is on the right side of the inline code, and is expected to be
	// positioned outside of the inline code after pressing arrow right
	// in both of these cases the cursor needs to be corrected to be positioned inline
	// with the node to the right
	// NOTE: In editor-plugin-text-formatting there is logic on left/right key press
	// which dispatches a transaction to update the stored marks
	if (
		(isInlineCodeToRight && isInlineCodeBeingStored) ||
		(isInlineCodeToLeft && isStoredMarksBeingCleared)
	) {
		return MarksSide.Right;
	}

	return MarksSide.None;
}
