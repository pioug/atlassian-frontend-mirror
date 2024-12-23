import type { Command } from '@atlaskit/editor-common/types';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { emptyCell, findCellClosestToPos, isSelectionType } from '@atlaskit/editor-tables/utils';

export const clearMultipleCells =
	(targetCellPosition?: number): Command =>
	(state, dispatch) => {
		let cursorPos: number | undefined;
		let { tr } = state;

		if (isSelectionType(tr.selection, 'cell')) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const selection = tr.selection as any as CellSelection;
			selection.forEachCell((_node, pos) => {
				const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				tr = emptyCell(findCellClosestToPos($pos)!, state.schema)(tr);
			});
			cursorPos = selection.$headCell.pos;
		} else if (targetCellPosition) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition + 1))!;
			tr = emptyCell(cell, state.schema)(tr);
			cursorPos = cell.pos;
		}
		if (tr.docChanged && cursorPos) {
			const $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
			const textSelection = Selection.findFrom($pos, 1, true);
			if (textSelection) {
				tr.setSelection(textSelection);
			}

			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		return false;
	};
