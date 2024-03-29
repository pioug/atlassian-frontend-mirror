import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type {
  Command,
  GetEditorContainerWidth,
} from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { TableMap } from '@atlaskit/editor-tables';
import type { CellAttributes, Direction } from '@atlaskit/editor-tables/types';
import {
  findCellClosestToPos,
  findCellRectClosestToPos,
  findTableClosestToPos,
  getSelectionRect,
  isSelectionType,
  nextCell,
} from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { getDecorations } from '../pm-plugins/decorations/plugin';
import {
  buildColumnResizingDecorations,
  clearColumnResizingDecorations,
} from '../pm-plugins/decorations/utils';
import { createCommand, getPluginState } from '../pm-plugins/plugin-factory';
import {
  getPluginState as getTableResizingPluginState,
  createCommand as tableResizingPluginCreateCommand,
} from '../pm-plugins/table-resizing/plugin-factory';
import { pluginKey as tableResizingPK } from '../pm-plugins/table-resizing/plugin-key';
import {
  currentColWidth,
  getResizeState,
  getTableMaxWidth,
  resizeColumn,
  updateControls,
} from '../pm-plugins/table-resizing/utils';
import { updateColumnWidths } from '../transforms';
import { TableDecorations } from '../types';
import type { TablePluginAction } from '../types';
import {
  createColumnLineResize,
  getSelectedColumnIndexes,
  updateDecorations,
} from '../utils';

const getTablePluginCommand = (
  actionPayload: TablePluginAction,
  originalTr?: Transaction,
): Command => {
  return createCommand(
    () => actionPayload,
    (tr) => (originalTr || tr).setMeta('addToHistory', false),
  );
};

const updateResizeHandleAndStatePosition =
  (
    rowIndex: number,
    columnIndex: number,
    nextResizeHandlePos: number,
  ): Command =>
  (state, dispatch) => {
    let customTr = state.tr;
    const {
      pluginConfig: { allowColumnResizing },
      getIntl,
    } = getPluginState(state);

    const fakeDispatch = (tr: Transaction) => {
      customTr = tr;
    };

    if (!allowColumnResizing) {
      return false;
    }

    const decorationsWithWidget = buildColumnResizingDecorations(
      rowIndex,
      columnIndex,
      true,
      getIntl,
    )({
      tr: customTr,
      decorationSet: getDecorations(state),
    });

    const decorationsWithWidgetAndHandle = updateDecorations(
      customTr.doc,
      decorationsWithWidget,
      createColumnLineResize(state.selection, {
        right: columnIndex,
      }),
      TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
    );

    getTablePluginCommand(
      {
        type: 'START_KEYBOARD_COLUMN_RESIZE',
        data: {
          resizeHandleRowIndex: rowIndex,
          resizeHandleColumnIndex: columnIndex,
          resizeHandleIncludeTooltip: true,
          isKeyboardResize: true,
          decorationSet: decorationsWithWidgetAndHandle,
        },
      },
      customTr,
    )(state, fakeDispatch);

    customTr.setMeta(tableResizingPK, {
      type: 'SET_RESIZE_HANDLE_POSITION',
      data: {
        resizeHandlePos: nextResizeHandlePos,
      },
    });

    if (dispatch) {
      dispatch(customTr);
      return true;
    }
    return false;
  };

export const initiateKeyboardColumnResizing: Command = (
  state,
  dispatch,
  view,
) => {
  if (!getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
    return false;
  }
  const { selection } = state;
  const selectionRect = isSelectionType(selection, 'cell')
    ? getSelectionRect(selection)!
    : findCellRectClosestToPos(selection.$from);
  const cell = findCellClosestToPos(selection.$from);

  if (selectionRect && cell && view) {
    return updateResizeHandleAndStatePosition(
      selectionRect.top,
      selectionRect.right,
      cell.pos,
    )(state, dispatch);
  }
  return false;
};

export const activateNextResizeArea =
  (direction: Direction): Command =>
  (state, dispatch, view) => {
    if (!getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
      return false;
    }
    const { resizeHandlePos } = getTableResizingPluginState(state) || {};
    // If No resizing has initiated, skip to regular handler
    if (!resizeHandlePos) {
      return false;
    }

    const { selection } = state;
    const cell = findCellClosestToPos(selection.$from);
    if (!cell) {
      // cursor position may be changed by mouse to be outside of table;
      return false;
    }

    const $currentCell = state.doc.resolve(resizeHandlePos);
    if (!$currentCell) {
      return false;
    }

    const tableNode = $currentCell.node(-1);
    const closestTable = findTableClosestToPos($currentCell);
    const tableMap = TableMap.get(tableNode);

    if (!tableNode || !closestTable || !tableMap) {
      return false;
    }

    const currentCellRect = tableMap.findCell(
      $currentCell.pos - $currentCell.start(-1),
    );

    const $nextCell = nextCell($currentCell, 'horiz', direction);

    if ($nextCell) {
      // we are somewhere in between the side columns of the table
      const offset = $nextCell.pos - $nextCell.start(-1);
      const rectForNextCell = tableMap.findCell(offset);
      return updateResizeHandleAndStatePosition(
        rectForNextCell.top,
        rectForNextCell.right,
        $nextCell.pos,
      )(state, dispatch, view);
    } else {
      // current position is in the one of the side columns of the table(left or right)
      if (currentCellRect.left === 0) {
        const lastCellInCurrentRow =
          tableMap.positionAt(
            currentCellRect.top,
            tableMap.width - 1,
            tableNode,
          ) + closestTable.start;
        const $lastCell = state.doc.resolve(lastCellInCurrentRow);

        return updateResizeHandleAndStatePosition(
          currentCellRect.top,
          tableMap.width,
          $lastCell.pos,
        )(state, dispatch, view);
      } else if (tableMap.width === currentCellRect.right) {
        const firsCellInCurrentRow =
          tableMap.positionAt(currentCellRect.top, 0, tableNode) +
          closestTable.start;
        const $nextCell = state.doc.resolve(firsCellInCurrentRow);

        return updateResizeHandleAndStatePosition(
          currentCellRect.top,
          1,
          $nextCell.pos,
        )(state, dispatch);
      }
    }
    return false;
  };

export const changeColumnWidthByStep =
  (
    stepSize: number,
    getEditorContainerWidth: GetEditorContainerWidth,
    isTableScalingEnabled = false,
  ): Command =>
  (state, dispatch, view) => {
    let customTr = state.tr;
    const fakeDispatch = (tr: Transaction) => {
      customTr = tr;
    };
    if (!getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
      return false;
    }
    const { resizeHandlePos } = getTableResizingPluginState(state);
    const cell = findCellClosestToPos(state.selection.$from);
    if (!view || !resizeHandlePos || !cell) {
      return false;
    }

    const $cell = state.doc.resolve(resizeHandlePos);

    const tableStartPosition = $cell.start(-1);
    const originalTable = $cell.node(-1);
    const map = TableMap.get(originalTable);
    const domAtPos = view.domAtPos.bind(view);

    const colIndex =
      map.colCount($cell.pos - tableStartPosition) +
      ($cell.nodeAfter ? $cell.nodeAfter.attrs.colspan : 1) -
      1;

    let dom: HTMLTableElement = domAtPos(tableStartPosition)
      .node as HTMLTableElement;

    if (dom && dom.nodeName !== 'TABLE') {
      dom = dom.closest('table') as HTMLTableElement;
    }

    const cellAttrs = cell?.node.attrs;
    const width = currentColWidth(view, cell?.pos, cellAttrs as CellAttributes);
    tableResizingPluginCreateCommand({
      type: 'SET_DRAGGING',
      data: {
        dragging: {
          startX: 0,
          startWidth: width,
        },
      },
    })(state, fakeDispatch);

    const maxSize = getTableMaxWidth({
      table: originalTable,
      tableStart: tableStartPosition,
      state,
      layout: originalTable.attrs.layout,
      getEditorContainerWidth,
    });

    const initialResizeState = getResizeState({
      minWidth: tableCellMinWidth,
      maxSize,
      table: originalTable,
      tableRef: dom,
      start: tableStartPosition,
      domAtPos,
      isTableScalingEnabled,
    });

    updateControls()(state);

    const selectionRect = getSelectionRect(state.selection);
    const selectedColumns = selectionRect
      ? getSelectedColumnIndexes(selectionRect)
      : [];
    // only selected (or selected - 1) columns should be distributed
    const resizingSelectedColumns =
      selectedColumns.indexOf(colIndex) > -1 ||
      selectedColumns.indexOf(colIndex + 1) > -1;
    const newResizeState = resizeColumn(
      initialResizeState,
      colIndex,
      stepSize,
      dom,
      originalTable,
      resizingSelectedColumns ? selectedColumns : undefined,
      isTableScalingEnabled,
    );

    customTr = updateColumnWidths(
      newResizeState,
      originalTable,
      tableStartPosition,
    )(customTr);

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };

export const stopKeyboardColumnResizing =
  (originalTr?: Transaction): Command =>
  (state, dispatch) => {
    if (!getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
      return false;
    }
    let customTr = originalTr || state.tr;
    const fakeDispatch = (tr: Transaction) => {
      customTr = tr;
    };

    const decorationWithoutWidget = clearColumnResizingDecorations()({
      tr: customTr,
      decorationSet: getDecorations(state),
    });

    const decorationWithoutWidgetAndHandle = updateDecorations(
      customTr.doc,
      decorationWithoutWidget,
      [],
      TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
    );
    getTablePluginCommand(
      {
        type: 'STOP_KEYBOARD_COLUMN_RESIZE',
        data: {
          decorationSet: decorationWithoutWidgetAndHandle,
        },
      },
      customTr,
    )(state, fakeDispatch);

    tableResizingPluginCreateCommand(
      {
        type: 'STOP_RESIZING',
      },
      () => customTr.setMeta('scrollIntoView', false),
    )(state, fakeDispatch);

    if (dispatch) {
      dispatch(customTr);
      return true;
    }
    return false;
  };
