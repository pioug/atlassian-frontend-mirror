import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { Rect } from '@atlaskit/editor-tables/table-map';
import {
  findCellClosestToPos,
  findCellRectClosestToPos,
  getSelectionRect,
} from '@atlaskit/editor-tables/utils';
import { Selection } from 'prosemirror-state';

import { tableBackgroundColorPalette, TableLayout } from '@atlaskit/adf-schema';

import { Command } from '../../types';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
  TABLE_ACTION,
  TABLE_BREAKOUT,
  withAnalytics,
  AnalyticsEventPayload,
} from '../analytics';

import { clearMultipleCells } from './commands/clear';
import { wrapTableInExpand } from './commands/collapse';
import { insertColumn, insertRow } from './commands/insert';
import {
  deleteTable,
  setMultipleCellAttrs,
  deleteTableIfSelected,
} from './commands/misc';
import { sortByColumn } from './commands/sort';
import { splitCell } from './commands/split-cell';
import {
  getNextLayout,
  toggleHeaderColumn,
  toggleHeaderRow,
  toggleNumberColumn,
  toggleTableLayout,
} from './commands/toggle';
import { distributeColumnsWidths } from './pm-plugins/table-resizing/commands';
import { getPluginState } from './pm-plugins/plugin-factory';
import { deleteColumns, deleteRows, mergeCells } from './transforms';
import { InsertRowMethods, InsertRowOptions, RowInsertPosition } from './types';

import { TableSortOrder as SortOrder } from '@atlaskit/adf-schema/steps';
import {
  checkIfNumberColumnEnabled,
  getSelectedCellInfo,
  getSelectedTableInfo,
} from './utils';
import { getAllowAddColumnCustomStep } from './utils/get-allow-add-column-custom-step';
import { ResizeStateWithAnalytics } from './pm-plugins/table-resizing/utils';

const TABLE_BREAKOUT_NAME_MAPPING = {
  default: TABLE_BREAKOUT.NORMAL,
  wide: TABLE_BREAKOUT.WIDE,
  'full-width': TABLE_BREAKOUT.FULL_WIDTH,
};
// #region Analytics wrappers
export const emptyMultipleCellsWithAnalytics = (
  inputMethod:
    | INPUT_METHOD.CONTEXT_MENU
    | INPUT_METHOD.KEYBOARD
    | INPUT_METHOD.FLOATING_TB,
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
  })(clearMultipleCells(targetCellPosition));

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
  })(splitCell);

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
  })(setMultipleCellAttrs({ background: cellColor }, targetCellPosition));

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
  withAnalytics((state) => {
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
  })(insertRow(options.index, options.moveCursorToInsertedRow));

export const insertColumnWithAnalytics = (
  inputMethod:
    | INPUT_METHOD.CONTEXT_MENU
    | INPUT_METHOD.BUTTON
    | INPUT_METHOD.SHORTCUT
    | INPUT_METHOD.FLOATING_TB,
  position: number,
) =>
  withAnalytics((state) => {
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
  })(insertColumn(position));

export const deleteRowsWithAnalytics = (
  inputMethod:
    | INPUT_METHOD.CONTEXT_MENU
    | INPUT_METHOD.BUTTON
    | INPUT_METHOD.FLOATING_TB,
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
      dispatch(deleteRows(rect, isHeaderRowRequired)(state.tr));
    }
    return true;
  });

export const deleteColumnsWithAnalytics = (
  inputMethod:
    | INPUT_METHOD.CONTEXT_MENU
    | INPUT_METHOD.BUTTON
    | INPUT_METHOD.FLOATING_TB,
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
      dispatch(
        deleteColumns(rect, getAllowAddColumnCustomStep(state))(state.tr),
      );
    }
    return true;
  });

const getTableDeletedAnalytics = (
  selection: Selection,
  inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.KEYBOARD,
): AnalyticsEventPayload => {
  const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
  return {
    action: TABLE_ACTION.DELETED,
    actionSubject: ACTION_SUBJECT.TABLE,
    attributes: {
      inputMethod,
      totalRowCount,
      totalColumnCount,
    },
    eventType: EVENT_TYPE.TRACK,
  };
};

export const deleteTableWithAnalytics = () =>
  withAnalytics(({ selection }) =>
    getTableDeletedAnalytics(selection, INPUT_METHOD.FLOATING_TB),
  )(deleteTable);

export const deleteTableIfSelectedWithAnalytics = (
  inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.KEYBOARD,
) =>
  withAnalytics(({ selection }) =>
    getTableDeletedAnalytics(selection, inputMethod),
  )(deleteTableIfSelected);

export const toggleHeaderRowWithAnalytics = () =>
  withAnalytics((state) => {
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
  })(toggleHeaderRow);

export const toggleHeaderColumnWithAnalytics = () =>
  withAnalytics((state) => {
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
  })(toggleHeaderColumn);

export const toggleNumberColumnWithAnalytics = () =>
  withAnalytics((state) => {
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
  })(toggleNumberColumn);

export const toggleTableLayoutWithAnalytics = () =>
  withAnalytics((state) => {
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
  withAnalytics((state) => {
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

export const distributeColumnsWidthsWithAnalytics = (
  inputMethod: INPUT_METHOD.CONTEXT_MENU,
  { resizeState, table, attributes }: ResizeStateWithAnalytics,
) => {
  return withAnalytics(() => {
    return {
      action: TABLE_ACTION.DISTRIBUTED_COLUMNS_WIDTHS,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        inputMethod,
        ...attributes,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })((state, dispatch) => {
    if (dispatch) {
      distributeColumnsWidths(resizeState, table)(state, dispatch);
    }
    return true;
  });
};

export const wrapTableInExpandWithAnalytics = () =>
  withAnalytics((state) => {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    return {
      action: TABLE_ACTION.COLLAPSED,
      actionSubject: ACTION_SUBJECT.TABLE,
      actionSubjectId: null,
      attributes: {
        totalRowCount,
        totalColumnCount,
      },
      eventType: EVENT_TYPE.TRACK,
    };
  })(wrapTableInExpand);
// #endregion
