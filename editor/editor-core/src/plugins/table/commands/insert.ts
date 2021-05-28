// #region Imports
import { Selection, Transaction } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  addColumnAt as addColumnAtPMUtils,
  addRowAt,
  createTable as createTableNode,
  findTable,
  selectedRect,
} from '@atlaskit/editor-tables/utils';
import { safeInsert } from 'prosemirror-utils';

import { AddColumnStep } from '@atlaskit/adf-schema/steps';

import { Command } from '../../../types';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { checkIfHeaderRowEnabled, copyPreviousRow } from '../utils';
import { getAllowAddColumnCustomStep } from '../utils/get-allow-add-column-custom-step';
// #endregion

function addColumnAtCustomStep(column: number) {
  return (tr: Transaction) => {
    const table = findTable(tr.selection);
    if (table) {
      return tr.step(AddColumnStep.create(tr.doc, table.pos, column));
    }
    return tr;
  };
}

function addColumnAt(
  column: number,
  allowAddColumnCustomStep: boolean = false,
) {
  if (allowAddColumnCustomStep) {
    return addColumnAtCustomStep(column);
  }
  return addColumnAtPMUtils(column);
}

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column before the column with the selection.
export const addColumnBefore: Command = (state, dispatch) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  if (dispatch) {
    let rect = selectedRect(state);
    dispatch(
      addColumnAt(rect.left, getAllowAddColumnCustomStep(state))(state.tr),
    );
  }
  return true;
};

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column after the column with the selection.
export const addColumnAfter: Command = (state, dispatch) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  if (dispatch) {
    let rect = selectedRect(state);
    dispatch(
      addColumnAt(rect.right, getAllowAddColumnCustomStep(state))(state.tr),
    );
  }
  return true;
};

// #region Commands
export const insertColumn = (column: number): Command => (state, dispatch) => {
  const tr = addColumnAt(column, getAllowAddColumnCustomStep(state))(state.tr);
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

export const createTable = (allowLocalIdGeneration?: boolean): Command => (
  state,
  dispatch,
) => {
  if (!getPluginState(state)) {
    return false;
  }
  const table = createTableNode({
    schema: state.schema,
    allowLocalId: allowLocalIdGeneration,
  });

  if (dispatch) {
    dispatch(safeInsert(table)(state.tr).scrollIntoView());
  }
  return true;
};
// #endregion
