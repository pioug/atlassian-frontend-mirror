// #region Imports
import { Selection } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import {
  findCellClosestToPos,
  emptyCell,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';

import { Command } from '../../../types';
// #endregion

// #region Commands
export const clearMultipleCells = (targetCellPosition?: number): Command => (
  state,
  dispatch,
) => {
  let cursorPos: number | undefined;
  let { tr } = state;

  if (isSelectionType(tr.selection, 'cell')) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((_node, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = emptyCell(findCellClosestToPos($pos)!, state.schema)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetCellPosition) {
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

export const clearSelection: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr
        .setSelection(Selection.near(state.selection.$from))
        .setMeta('addToHistory', false),
    );
  }
  return true;
};
// #endregion
