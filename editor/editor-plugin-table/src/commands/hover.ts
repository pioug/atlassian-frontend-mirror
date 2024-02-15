// #region Imports
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
} from '@atlaskit/editor-tables/utils';

import { createCommand, getPluginState } from '../pm-plugins/plugin-factory';
import type { Cell, CellColumnPositioning } from '../types';
import { TableDecorations } from '../types';
import {
  createCellHoverDecoration,
  createColumnLineResize,
  createControlsHoverDecoration,
  getMergedCellsPositions,
  updatePluginStateDecorations,
} from '../utils';

const makeArray = (n: number) => Array.from(Array(n).keys());

export const hoverMergedCells = () =>
  createCommand(
    (state) => {
      const mergedCellsPositions = getMergedCellsPositions(state.tr);
      if (!mergedCellsPositions.length) {
        return false;
      }
      const table = findTable(state.tr.selection);
      if (!table) {
        return false;
      }

      const mergedCells: Cell[] = mergedCellsPositions.map((pos) => ({
        pos: pos + table.start,
        start: pos + table.start + 1,
        node: table.node.nodeAt(pos)!,
      }));

      const decorations = createCellHoverDecoration(mergedCells);

      return {
        type: 'HOVER_MERGED_CELLS',
        data: {
          decorationSet: updatePluginStateDecorations(
            state,
            decorations,
            TableDecorations.CELL_CONTROLS_HOVER,
          ),
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const hoverColumns = (hoveredColumns: number[], isInDanger?: boolean) =>
  createCommand(
    (state) => {
      const cells = getCellsInColumn(hoveredColumns)(state.tr.selection);

      const { isDragAndDropEnabled } = getPluginState(state);
      if (!cells) {
        return false;
      }

      const decorations = createControlsHoverDecoration(
        cells,
        'column',
        state.tr,
        isDragAndDropEnabled,
        hoveredColumns,
        isInDanger,
      );

      return {
        type: 'HOVER_COLUMNS',
        data: {
          decorationSet: updatePluginStateDecorations(
            state,
            decorations,
            TableDecorations.COLUMN_CONTROLS_HOVER,
          ),
          hoveredColumns,
          isInDanger,
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const hoverRows = (hoveredRows: number[], isInDanger?: boolean) =>
  createCommand(
    (state) => {
      const cells = getCellsInRow(hoveredRows)(state.selection);
      if (!cells) {
        return false;
      }
      const { isDragAndDropEnabled } = getPluginState(state);
      const decorations = createControlsHoverDecoration(
        cells,
        'row',
        state.tr,
        isDragAndDropEnabled,
        hoveredRows,
        isInDanger,
      );

      return {
        type: 'HOVER_ROWS',
        data: {
          decorationSet: updatePluginStateDecorations(
            state,
            decorations,
            TableDecorations.ROW_CONTROLS_HOVER,
          ),
          hoveredRows,
          isInDanger,
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const hoverTable = (isInDanger?: boolean, isSelected?: boolean) =>
  createCommand(
    (state) => {
      const table = findTable(state.selection);
      if (!table) {
        return false;
      }
      const map = TableMap.get(table.node);
      const hoveredColumns = makeArray(map.width);
      const hoveredRows = makeArray(map.height);
      const cells = getCellsInRow(hoveredRows)(state.selection);
      if (!cells) {
        return false;
      }
      const { isDragAndDropEnabled } = getPluginState(state);
      const decorations = createControlsHoverDecoration(
        cells,
        'table',
        state.tr,
        isDragAndDropEnabled,
        [],
        isInDanger,
        isSelected,
      );

      return {
        type: 'HOVER_TABLE',
        data: {
          decorationSet: updatePluginStateDecorations(
            state,
            decorations,
            TableDecorations.TABLE_CONTROLS_HOVER,
          ),
          hoveredColumns,
          hoveredRows,
          isInDanger,
          isWholeTableInDanger: isInDanger,
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const clearHoverSelection = () =>
  createCommand((state) => ({
    type: 'CLEAR_HOVER_SELECTION',
    data: {
      decorationSet: updatePluginStateDecorations(
        state,
        [],
        TableDecorations.ALL_CONTROLS_HOVER,
      ),
      isInDanger: false,
      isWholeTableInDanger: false,
    },
  }));

export const showResizeHandleLine = (
  cellColumnPositioning: CellColumnPositioning,
) =>
  createCommand((state) => ({
    type: 'SHOW_RESIZE_HANDLE_LINE',
    data: {
      decorationSet: updatePluginStateDecorations(
        state,
        createColumnLineResize(state.selection, cellColumnPositioning),
        TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
      ),
    },
  }));

export const hideResizeHandleLine = () =>
  createCommand((state) => ({
    type: 'HIDE_RESIZE_HANDLE_LINE',
    data: {
      decorationSet: updatePluginStateDecorations(
        state,
        [],
        TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
      ),
    },
  }));

export const setTableHovered = (hovered: boolean) =>
  createCommand(
    () => {
      return {
        type: 'TABLE_HOVERED',
        data: {
          isTableHovered: hovered,
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const hoverCell = (rowIndex?: number, colIndex?: number) =>
  createCommand(
    (state) => {
      const { hoveredCell: prevHoveredCell } = getPluginState(state);

      // If no arguments have been passed then the intention it to reset the hover cell data
      const clear = rowIndex === undefined && colIndex === undefined;

      const nextRowIndex = clear
        ? undefined
        : rowIndex ?? prevHoveredCell.rowIndex;
      const nextColIndex = clear
        ? undefined
        : colIndex ?? prevHoveredCell.colIndex;

      if (
        nextRowIndex === prevHoveredCell.rowIndex &&
        nextColIndex === prevHoveredCell.colIndex
      ) {
        return false;
      }

      return {
        type: 'HOVER_CELL',
        data: {
          hoveredCell: {
            rowIndex: nextRowIndex,
            colIndex: nextColIndex,
          },
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );
