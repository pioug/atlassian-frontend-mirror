import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import type { EditorCommand } from '../types';

/**
 * A wrapper around ProseMirror removeMark and removeStoredMark, which handles mark removal in text, CellSelections and cursor stored marks.
 */
export const removeMark =
	(mark: MarkType | Mark): EditorCommand =>
	({ tr }) => {
		const { selection } = tr;

		if (selection instanceof CellSelection) {
			selection.forEachCell((cell, cellPos) => {
				const from = cellPos;
				const to = cellPos + cell.nodeSize;
				tr.removeMark(from, to, mark);
			});
		} else if (selection instanceof TextSelection && selection.$cursor) {
			tr.removeStoredMark(mark);
		} else {
			const { from, to } = selection;
			tr.removeMark(from, to, mark);
		}

		return tr;
	};
