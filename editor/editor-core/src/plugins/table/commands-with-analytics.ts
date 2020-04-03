import { Rect, CellSelection } from 'prosemirror-tables';
import { findCellClosestToPos } from 'prosemirror-utils';
import { TableLayout, tableBackgroundColorPalette } from '@atlaskit/adf-schema';

import {
  analyticsService as analyticsV2,
  withAnalytics as withV2Analytics,
} from '../../analytics';
import {
  withAnalytics,
  TABLE_ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
  TABLE_BREAKOUT,
} from '../analytics';
import { insertColumn, insertRow } from './commands/insert';
import { clearMultipleCells } from './commands/clear';
import { setMultipleCellAttrs, deleteTable } from './commands/misc';
import {
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleNumberColumn,
  toggleTableLayout,
  getNextLayout,
} from './commands/toggle';
import { sortByColumn } from './commands/sort';
import {
  getSelectedCellInfo,
  getSelectedTableInfo,
  checkIfNumberColumnEnabled,
} from './utils';
import { mergeCells, deleteColumns, deleteRows } from './transforms';
import {
  InsertRowMethods,
  InsertRowOptions,
  SortOrder,
  RowInsertPosition,
} from './types';
import { Command } from '../../types';
import { getSelectionRect, findCellRectClosestToPos } from 'prosemirror-utils';
import { getPluginState } from './pm-plugins/plugin-factory';
import { splitCell } from './commands/split-cell';

const TABLE_BREAKOUT_NAME_MAPPING = {
  default: TABLE_BREAKOUT.NORMAL,
  wide: TABLE_BREAKOUT.WIDE,
  'full-width': TABLE_BREAKOUT.FULL_WIDTH,
};
// #region Analytics wrappers
export const emptyMultipleCellsWithAnalytics = (
  inputMethod: INPUT_METHOD.CONTEXT_MENU | INPUT_METHOD.KEYBOARD,
  targetCellPosition?: number,
) =>
  withAnalytics(({ selection }) => {
    const {
      horizontalCells,
      verticalCells,
      totalRowCount,
      totalColumnCount,
    } = getSelectedCellInfo(selection);

    return {
      action: TABLE_ACTION.CLEARED,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod,
        horizontalCells,
        verticalCells,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      `atlassian.editor.format.table.delete_content.${
        inputMethod === INPUT_METHOD.KEYBOARD ? 'keyboard' : 'button'
      }`,
      clearMultipleCells(targetCellPosition),
    ),
  );

export const mergeCellsWithAnalytics = () =>
  withAnalytics(({ selection }) => {
    const {
      horizontalCells,
      verticalCells,
      totalCells,
      totalRowCount,
      totalColumnCount,
    } = getSelectedCellInfo(selection);

    return {
      action: TABLE_ACTION.MERGED,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        horizontalCells,
        verticalCells,
        totalCells,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })((state, dispatch) => {
    if (dispatch) {
      analyticsV2.trackEvent('atlassian.editor.format.table.merge.button');
      dispatch(mergeCells(state.tr));
    }
    return true;
  });

export const splitCellWithAnalytics = () =>
  withAnalytics(({ selection }) => {
    const { totalRowCount, totalColumnCount } = getSelectedCellInfo(selection);
    const cell = findCellClosestToPos(selection.$anchor);
    if (cell) {
      const {
        rowspan: verticalCells,
        colspan: horizontalCells,
      } = cell.node.attrs;

      return {
        action: TABLE_ACTION.SPLIT,
        actionSubject: ACTION_SUBJECT.TABLE,
        actionSubjectId: null,
        attributes: {
          horizontalCells,
          verticalCells,
          totalCells: horizontalCells * verticalCells,
          totalRowCount,
          totalColumnCount,
        },
        eventType: EVENT_TYPE.TRACK,
      };
    }
    return;
  })(withV2Analytics('atlassian.editor.format.table.split.button', splitCell));

export const setColorWithAnalytics = (
  cellColor: string,
  targetCellPosition?: number,
) =>
  withAnalytics(({ selection }) => {
    const {
      horizontalCells,
      verticalCells,
      totalCells,
      totalRowCount,
      totalColumnCount,
    } = getSelectedCellInfo(selection);

    return {
      action: TABLE_ACTION.COLORED,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        cellColor: (
          tableBackgroundColorPalette.get(cellColor.toLowerCase()) || cellColor
        ).toLowerCase(),
        horizontalCells,
        verticalCells,
        totalCells,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      'atlassian.editor.format.table.backgroundColor.button',
      setMultipleCellAttrs({ background: cellColor }, targetCellPosition),
    ),
  );

export const addRowAroundSelection = (side: RowInsertPosition): Command => (
  state,
  dispatch,
) => {
  const { selection } = state;
  const isCellSelection = selection instanceof CellSelection;
  const rect = isCellSelection
    ? getSelectionRect(selection)
    : findCellRectClosestToPos(selection.$from);

  if (!rect) {
    return false;
  }

  const position =
    isCellSelection && side === 'TOP' ? rect.top : rect.bottom - 1;

  const offset = side === 'BOTTOM' ? 1 : 0;

  return insertRowWithAnalytics(INPUT_METHOD.SHORTCUT, {
    index: position + offset,
    moveCursorToInsertedRow: false,
  })(state, dispatch);
};

export const insertRowWithAnalytics = (
  inputMethod: InsertRowMethods,
  options: InsertRowOptions,
) =>
  withAnalytics(state => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    return {
      action: TABLE_ACTION.ADDED_ROW,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod,
        position: options.index,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      `atlassian.editor.format.table.row.${
        inputMethod === INPUT_METHOD.KEYBOARD ? 'keyboard' : 'button'
      }`,
      insertRow(options.index, options.moveCursorToInsertedRow),
    ),
  );

export const insertColumnWithAnalytics = (
  inputMethod:
    | INPUT_METHOD.CONTEXT_MENU
    | INPUT_METHOD.BUTTON
    | INPUT_METHOD.SHORTCUT,
  position: number,
) =>
  withAnalytics(state => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    return {
      action: TABLE_ACTION.ADDED_COLUMN,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod,
        position,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      'atlassian.editor.format.table.column.button',
      insertColumn(position),
    ),
  );

export const deleteRowsWithAnalytics = (
  inputMethod: INPUT_METHOD.CONTEXT_MENU | INPUT_METHOD.BUTTON,
  rect: Rect,
  isHeaderRowRequired: boolean,
) =>
  withAnalytics(({ selection }) => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);

    return {
      action: TABLE_ACTION.DELETED_ROW,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod,
        position: rect.top,
        count: rect.bottom - rect.top,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })((state, dispatch) => {
    if (dispatch) {
      analyticsV2.trackEvent('atlassian.editor.format.table.delete_row.button');
      dispatch(deleteRows(rect, isHeaderRowRequired)(state.tr));
    }
    return true;
  });

export const deleteColumnsWithAnalytics = (
  inputMethod: INPUT_METHOD.CONTEXT_MENU | INPUT_METHOD.BUTTON,
  rect: Rect,
) =>
  withAnalytics(({ selection }) => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);

    return {
      action: TABLE_ACTION.DELETED_COLUMN,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod,
        position: rect.left,
        count: rect.right - rect.left,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })((state, dispatch) => {
    if (dispatch) {
      analyticsV2.trackEvent(
        'atlassian.editor.format.table.delete_column.button',
      );
      dispatch(deleteColumns(rect)(state.tr));
    }
    return true;
  });

export const deleteTableWithAnalytics = () =>
  withAnalytics(({ selection }) => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
    return {
      action: TABLE_ACTION.DELETED,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod: INPUT_METHOD.FLOATING_TB,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics('atlassian.editor.format.table.delete.button', deleteTable),
  );

export const toggleHeaderRowWithAnalytics = () =>
  withAnalytics(state => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    const { isHeaderRowEnabled } = getPluginState(state);

    return {
      action: TABLE_ACTION.TOGGLED_HEADER_ROW,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        newState: !isHeaderRowEnabled,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      'atlassian.editor.format.table.toggleHeaderRow.button',
      toggleHeaderRow,
    ),
  );

export const toggleHeaderColumnWithAnalytics = () =>
  withAnalytics(state => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    const { isHeaderColumnEnabled } = getPluginState(state);

    return {
      action: TABLE_ACTION.TOGGLED_HEADER_COLUMN,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        newState: !isHeaderColumnEnabled,
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      'atlassian.editor.format.table.toggleHeaderColumn.button',
      toggleHeaderColumn,
    ),
  );

export const toggleNumberColumnWithAnalytics = () =>
  withAnalytics(state => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    return {
      action: TABLE_ACTION.TOGGLED_NUMBER_COLUMN,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        newState: !checkIfNumberColumnEnabled(state),
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(
    withV2Analytics(
      'atlassian.editor.format.table.toggleNumberColumn.button',
      toggleNumberColumn,
    ),
  );

export const toggleTableLayoutWithAnalytics = () =>
  withAnalytics(state => {
    const { table, totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );

    if (table) {
      const { layout } = table.node.attrs as { layout: TableLayout };
      return {
        action: TABLE_ACTION.CHANGED_BREAKOUT_MODE,
        actionSubject: ACTION_SUBJECT.TABLE,
        actionSubjectId: null,
        attributes: {
          newBreakoutMode: TABLE_BREAKOUT_NAME_MAPPING[getNextLayout(layout)],
          previousBreakoutMode: TABLE_BREAKOUT_NAME_MAPPING[layout],
          totalRowCount,
          totalColumnCount,
        },
        eventType: EVENT_TYPE.TRACK,
      };
    }
    return;
  })(toggleTableLayout);

export const sortColumnWithAnalytics = (
  inputMethod: INPUT_METHOD.CONTEXT_MENU,
  columnIndex: number,
  sortOrder: SortOrder,
) =>
  withAnalytics(state => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    return {
      action: TABLE_ACTION.SORTED_COLUMN,
      actionSubject: ACTION_SUBJECT.TABLE,
      attributes: {
        inputMethod,
        totalRowCount,
        totalColumnCount,
        position: columnIndex,
        sortOrder,
        mode: 'editor',
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(sortByColumn(columnIndex, sortOrder));
// #endregion
