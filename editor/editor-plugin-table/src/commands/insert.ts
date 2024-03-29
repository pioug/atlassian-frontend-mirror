// #region Imports
import { AddColumnStep } from '@atlaskit/custom-steps';
import type {
  EditorAnalyticsAPI,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  TABLE_OVERFLOW_CHANGE_TRIGGER,
} from '@atlaskit/editor-common/analytics';
import type { Command, EditorCommand } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  addColumnAt as addColumnAtPMUtils,
  addRowAt,
  findTable,
  selectedRect,
} from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { updateRowOrColumnMovedTransform } from '../pm-plugins/analytics/commands';
import { META_KEYS } from '../pm-plugins/table-analytics';
import { rescaleColumns } from '../transforms/column-width';
import {
  checkIfHeaderRowEnabled,
  copyPreviousRow,
  createTableWithWidth,
} from '../utils';
import { getAllowAddColumnCustomStep } from '../utils/get-allow-add-column-custom-step';

function addColumnAtCustomStep(column: number) {
  return (tr: Transaction) => {
    const table = findTable(tr.selection);
    if (table) {
      return tr.step(AddColumnStep.create(tr.doc, table.pos, column));
    }
    return tr;
  };
}

export function addColumnAt(isTableScalingEnabled = false) {
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
        updatedTr = rescaleColumns(isTableScalingEnabled)(table, view)(
          updatedTr,
        );
      }

      if (
        getBooleanFF('platform.editor.table.analytics-plugin-moved-event') &&
        view
      ) {
        updatedTr = updateRowOrColumnMovedTransform(
          { type: 'column' },
          'addRowOrColumn',
        )(view.state, updatedTr);
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
  (isTableScalingEnabled = false): Command =>
  (state, dispatch, view) => {
    const table = findTable(state.selection);
    if (!table) {
      return false;
    }
    if (dispatch) {
      let rect = selectedRect(state);
      dispatch(
        addColumnAt(isTableScalingEnabled)(
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
  (isTableScalingEnabled?: boolean): Command =>
  (state, dispatch, view) => {
    const table = findTable(state.selection);
    if (!table) {
      return false;
    }
    if (dispatch) {
      let rect = selectedRect(state);
      dispatch(
        addColumnAt(isTableScalingEnabled)(
          rect.right,
          getAllowAddColumnCustomStep(state),
          view,
        )(state.tr),
      );
    }
    return true;
  };

export const insertColumn =
  (isTableScalingEnabled = false) =>
  (column: number): Command =>
  (state, dispatch, view) => {
    let tr = addColumnAt(isTableScalingEnabled)(
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

      if (getBooleanFF('platform.editor.table.analytics-plugin-moved-event')) {
        updateRowOrColumnMovedTransform(
          {
            type: 'row',
          },
          'addRowOrColumn',
        )(state, tr);
      }

      dispatch(tr);
    }
    return true;
  };

export const createTable =
  (
    isTableScalingEnabled?: boolean,
    isFullWidthModeEnabled?: boolean,
  ): Command =>
  (state, dispatch) => {
    const table = createTableWithWidth(
      isTableScalingEnabled,
      isFullWidthModeEnabled,
    )(state.schema);

    if (dispatch) {
      dispatch(safeInsert(table)(state.tr).scrollIntoView());
    }
    return true;
  };

export const insertTableWithSize =
  (
    isFullWidthModeEnabled?: boolean,
    isTableScalingEnabled?: boolean,
    editorAnalyticsAPI?: EditorAnalyticsAPI,
  ) =>
  (
    rowsCount: number,
    colsCount: number,
    inputMethod?: INPUT_METHOD.PICKER,
  ): EditorCommand => {
    return ({ tr }) => {
      const tableNode = createTableWithWidth(
        isTableScalingEnabled,
        isFullWidthModeEnabled,
        {
          rowsCount: rowsCount,
          colsCount: colsCount,
        },
      )(tr.doc.type.schema);

      const newTr = safeInsert(tableNode)(tr).scrollIntoView();
      if (inputMethod) {
        editorAnalyticsAPI?.attachAnalyticsEvent({
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.TABLE,
          attributes: {
            inputMethod: inputMethod,
            totalRowCount: rowsCount,
            totalColumnCount: colsCount,
          },
          eventType: EVENT_TYPE.TRACK,
        })(newTr);
      }
      return newTr;
    };
  };
