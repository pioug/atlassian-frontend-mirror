import { Command } from '../types';

import { addColumn } from './add-column';
import { addRow } from './add-row';
import { selectedRect } from './selection-rect';
import { isInTable } from './tables';

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Add a table row before the selection.
export const addRowBefore: Command = (state, dispatch) => {
  if (!isInTable(state)) {
    return false;
  }
  if (dispatch) {
    const rect = selectedRect(state);
    dispatch(addRow(state.tr, rect, rect.top));
  }
  return true;
};

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Add a table row after the selection.
export const addRowAfter: Command = (state, dispatch) => {
  if (!isInTable(state)) {
    return false;
  }
  if (dispatch) {
    const rect = selectedRect(state);
    dispatch(addRow(state.tr, rect, rect.bottom));
  }
  return true;
};

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column before the column with the selection.
export const addColumnBefore: Command = (state, dispatch) => {
  if (!isInTable(state)) {
    return false;
  }
  if (dispatch) {
    const rect = selectedRect(state);
    dispatch(addColumn(state.tr, rect, rect.left));
  }
  return true;
};

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column after the column with the selection.
export const addColumnAfter: Command = (state, dispatch) => {
  if (!isInTable(state)) {
    return false;
  }
  if (dispatch) {
    const rect = selectedRect(state);
    dispatch(addColumn(state.tr, rect, rect.right));
  }
  return true;
};
