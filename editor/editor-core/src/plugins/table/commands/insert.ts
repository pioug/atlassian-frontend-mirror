// #region Imports
import { Selection } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import {
  addColumnAt,
  addRowAt,
  createTable as createTableNode,
  findTable,
  safeInsert,
} from 'prosemirror-utils';
import { checkIfHeaderRowEnabled, copyPreviousRow } from '../utils';
import { Command } from '../../../types';
import { getPluginState } from '../pm-plugins/plugin-factory';
// #endregion

// #region Commands
export const insertColumn = (column: number): Command => (state, dispatch) => {
  const tr = addColumnAt(column)(state.tr);
  const table = findTable(tr.selection);
  if (!table) {
    return false;
  }
  // move the cursor to the newly created column
  const pos = TableMap.get(table.node).positionAt(0, column, table.node);
  if (dispatch) {
    dispatch(
      tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))),
    );
  }
  return true;
};

export const insertRow = (
  row: number,
  moveCursorToTheNewRow: boolean,
): Command => (state, dispatch) => {
  // Don't clone the header row
  const headerRowEnabled = checkIfHeaderRowEnabled(state);
  const clonePreviousRow =
    (headerRowEnabled && row > 1) || (!headerRowEnabled && row > 0);

  // When the table have header row
  // we should not add row on the position zero
  if (row === 0 && headerRowEnabled) {
    return false;
  }

  const tr = clonePreviousRow
    ? copyPreviousRow(state.schema)(row)(state.tr)
    : addRowAt(row)(state.tr);

  const table = findTable(tr.selection);
  if (!table) {
    return false;
  }
  if (dispatch) {
    const { selection } = state;
    if (moveCursorToTheNewRow) {
      // move the cursor to the newly created row
      const pos = TableMap.get(table.node).positionAt(row, 0, table.node);
      tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos)));
    } else {
      tr.setSelection(selection.map(tr.doc, tr.mapping));
    }

    dispatch(tr);
  }
  return true;
};

export const createTable: Command = (state, dispatch) => {
  if (!getPluginState(state)) {
    return false;
  }
  const table = createTableNode(state.schema);

  if (dispatch) {
    dispatch(safeInsert(table)(state.tr).scrollIntoView());
  }
  return true;
};
// #endregion
