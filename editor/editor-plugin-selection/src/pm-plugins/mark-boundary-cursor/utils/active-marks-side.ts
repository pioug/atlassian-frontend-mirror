import { isTextSelection } from '@atlaskit/editor-common/utils';
import { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { MarksSide } from '../marks-side';

import { getInlineCodeCursorSide } from './inline-code-side';

type GetActiveMarksSideOptions = {
	selection: Selection;
	storedMarks?: readonly Mark[] | null;
};

/**
 * Will determine which side of the current selection the mark-boundary-cursor should
 * favour / point towards, based on which marks are currently active and which marks
 * are applied to the nodes to the left and right side of the current selection.
 *
 * @param {Selection} options.selection - The current selection.
 * @param {readonly Mark[] | null} options.storedMarks - Current stored marks, if any.
 * @returns {MarksSide} - The side (left -1, right 1, or none 0) the mark-boundary-cursor should favour.
 */
export function getActiveMarksSide({
	selection,
	storedMarks,
}: GetActiveMarksSideOptions): MarksSide {
	if (!isTextSelection(selection) || !selection.empty) {
		return MarksSide.None;
	}

	const { nodeBefore, nodeAfter } = selection.$head;
	const leftMarks = nodeBefore?.marks ?? [];
	const rightMarks = nodeAfter?.marks ?? [];

	if (Mark.sameSet(leftMarks, rightMarks)) {
		return MarksSide.None;
	}

	return getInlineCodeCursorSide({ leftMarks, rightMarks, storedMarks });
}
