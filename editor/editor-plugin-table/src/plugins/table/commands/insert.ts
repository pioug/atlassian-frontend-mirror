// #region Imports
import { AddColumnStep } from '@atlaskit/custom-steps';
import { TABLE_OVERFLOW_CHANGE_TRIGGER } from '@atlaskit/editor-common/analytics';
import type {
  Command,
  GetEditorContainerWidth,
} from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  addColumnAt as addColumnAtPMUtils,
  addRowAt,
  createTable as createTableNode,
  findTable,
  selectedRect,
} from '@atlaskit/editor-tables/utils';

import { META_KEYS } from '../pm-plugins/table-analytics';
import { rescaleColumns } from '../transforms/column-width';
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

export function addColumnAt(getEditorContainerWidth: GetEditorContainerWidth) {
  return (
    column: number,
    allowAddColumnCustomStep: boolean = false,
    view: EditorView | undefined,
  ) => {
    return (tr: Transaction) => {
      let updatedTr = tr;
      if (allowAddColumnCustomStep) {
        updatedTr = addColumnAtCustomStep(column)(updatedTr);
      } else {
        updatedTr = addColumnAtPMUtils(column)(updatedTr);
      }
      const table = findTable(updatedTr.selection);
      if (table) {
        // [ED-8288] Update colwidths manually to avoid multiple dispatch in TableComponent
        updatedTr = rescaleColumns(getEditorContainerWidth)(table, view)(
          updatedTr,
        );
      }
      updatedTr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
        name: TABLE_OVERFLOW_CHANGE_TRIGGER.ADDED_COLUMN,
      });
      return updatedTr;
    };
  };
}

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column before the column with the selection.
export const addColumnBefore =
  (getEditorContainerWidth: GetEditorContainerWidth): Command =>
  (state, dispatch, view) => {
    const table = findTable(state.selection);
    if (!table) {
      return false;
    }
    if (dispatch) {
      let rect = selectedRect(state);
      dispatch(
        addColumnAt(getEditorContainerWidth)(
          rect.left,
          getAllowAddColumnCustomStep(state),
          view,
        )(state.tr),
      );
    }
    return true;
  };

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column after the column with the selection.
export const addColumnAfter =
  (getEditorContainerWidth: GetEditorContainerWidth): Command =>
  (state, dispatch, view) => {
    const table = findTable(state.selection);
    if (!table) {
      return false;
    }
    if (dispatch) {
      let rect = selectedRect(state);
      dispatch(
        addColumnAt(getEditorContainerWidth)(
          rect.right,
          getAllowAddColumnCustomStep(state),
          view,
        )(state.tr),
      );
    }
    return true;
  };

// #region Commands
export const insertColumn =
  (getEditorContainerWidth: GetEditorContainerWidth) =>
  (column: number): Command =>
  (state, dispatch, view) => {
    let tr = addColumnAt(getEditorContainerWidth)(
      column,
      getAllowAddColumnCustomStep(state),
      view,
    )(state.tr);
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

export const insertRow =
  (row: number, moveCursorToTheNewRow: boolean): Command =>
  (state, dispatch) => {
    // Don't clone the header row
    const headerRowEnabled = checkIfHeaderRowEnabled(state.selection);
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

export const createTable = (): Command => (state, dispatch) => {
  const table = createTableNode({
    schema: state.schema,
  });

  if (dispatch) {
    dispatch(safeInsert(table)(state.tr).scrollIntoView());
  }
  return true;
};
// #endregion
