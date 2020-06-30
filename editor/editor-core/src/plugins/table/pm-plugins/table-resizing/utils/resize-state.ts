import { Node as PMNode } from 'prosemirror-model';

import {
  calcTableColumnWidths,
  tableCellMinWidth,
  tableNewColumnMinWidth,
} from '@atlaskit/editor-common';

import { hasTableBeenResized, insertColgroupFromNode } from './colgroup';
import { getCellsRefsInColumn, getColumnStateFromDOM } from './column-state';
import { syncStickyRowToTable } from './dom';
import { ResizeState } from './types';

export const getResizeState = ({
  minWidth,
  maxSize,
  table,
  tableRef,
  start,
  domAtPos,
}: {
  minWidth: number;
  maxSize: number;
  table: PMNode;
  tableRef: HTMLTableElement;
  start: number;
  domAtPos: (pos: number) => { node: Node; offset: number };
}): ResizeState => {
  if (hasTableBeenResized(table)) {
    return {
      cols: calcTableColumnWidths(table).map((width, index) => ({
        width: width === 0 ? tableNewColumnMinWidth : width,
        minWidth: width === 0 ? tableNewColumnMinWidth : minWidth,
        index,
      })),
      maxSize,
    };
  }

  // Getting the resize state from DOM
  const colgroupChildren = insertColgroupFromNode(tableRef, table);
  return {
    cols: Array.from(colgroupChildren).map((_, index) => {
      const cellsRefs = getCellsRefsInColumn(index, table, start, domAtPos);
      return getColumnStateFromDOM(cellsRefs, index, minWidth);
    }),
    maxSize,
  };
};

// updates Colgroup DOM node with new widths
export const updateColgroup = (
  state: ResizeState,
  tableRef: HTMLElement,
): void => {
  const cols = tableRef.querySelectorAll('col');
  state.cols
    .filter(column => column && !!column.width) // if width is 0, we dont want to apply that.
    .forEach((column, i) => {
      if (cols[i]) {
        cols[i].style.width = `${column.width}px`;
      }
    });

  // colgroup has updated, reflect new widths in sticky header
  syncStickyRowToTable(tableRef);
};

export const getTotalWidth = ({ cols }: ResizeState): number => {
  return cols.reduce((totalWidth, col) => totalWidth + col.width, 0);
};

// adjust columns to take up the total width
// difference in total columns widths vs table width happens due to the "Math.floor"
export const adjustColumnsWidths = (
  resizeState: ResizeState,
  maxSize: number,
): ResizeState => {
  const totalWidth = getTotalWidth(resizeState);
  const diff = maxSize - totalWidth;
  if (diff > 0 || (diff < 0 && Math.abs(diff) < tableCellMinWidth)) {
    let updated = false;
    return {
      ...resizeState,
      cols: resizeState.cols.map(col => {
        if (!updated && col.width + diff > col.minWidth) {
          updated = true;
          return { ...col, width: col.width + diff };
        }
        return col;
      }),
    };
  }

  return resizeState;
};

export const evenAllColumnsWidths = (resizeState: ResizeState): ResizeState => {
  const maxSize = getTotalWidth(resizeState);
  const evenWidth = Math.floor(maxSize / resizeState.cols.length);
  const cols = resizeState.cols.map(col => ({ ...col, width: evenWidth }));

  return adjustColumnsWidths({ ...resizeState, cols }, maxSize);
};

export const bulkColumnsResize = (
  resizeState: ResizeState,
  columnsIndexes: number[],
  sourceColumnIndex: number,
) => {
  const currentTableWidth = getTotalWidth(resizeState);
  const colIndex =
    columnsIndexes.indexOf(sourceColumnIndex) > -1
      ? sourceColumnIndex
      : sourceColumnIndex + 1;
  const sourceCol = resizeState.cols[colIndex];
  const seenColumns: {
    [key: number]: { width: number; minWidth: number; index: number };
  } = {};
  const widthsDiffs: number[] = [];
  const cols = resizeState.cols.map(col => {
    if (columnsIndexes.indexOf(col.index) > -1) {
      const diff = col.width - sourceCol.width;
      if (diff !== 0) {
        widthsDiffs.push(diff);
      }
      return { ...col, width: sourceCol.width };
    }
    return col;
  });

  let newState = {
    ...resizeState,
    cols: cols.map(col => {
      if (
        columnsIndexes.indexOf(col.index) > -1 ||
        // take from prev columns only if dragging the first handle to the left
        (columnsIndexes.indexOf(sourceColumnIndex) > -1 && col.index < colIndex)
      ) {
        return col;
      }
      while (widthsDiffs.length) {
        const diff = widthsDiffs.shift() || 0;
        const column = seenColumns[col.index] || col;
        const maybeWidth = column.width + diff;

        if (maybeWidth > column.minWidth) {
          seenColumns[column.index] = { ...column, width: maybeWidth };
        } else {
          widthsDiffs.push(maybeWidth - column.minWidth);
          seenColumns[column.index] = { ...column, width: column.minWidth };
          break;
        }
      }
      return seenColumns[col.index] || col;
    }),
  };

  // minimum possible table widths at the current layout
  const minTableWidth = resizeState.maxSize;
  // new table widths after bulk resize
  const newTotalWidth = getTotalWidth(newState);
  // when all columns are selected, what do we do when sum of columns widths is lower than min possible table widths?
  if (
    columnsIndexes.length === resizeState.cols.length &&
    newTotalWidth < minTableWidth
  ) {
    // table is not in overflow -> normal resize of a single column
    if (currentTableWidth === minTableWidth) {
      return resizeState;
    }
    // table is in overflow: keep the dragged column at its widths and evenly distribute columns
    // to recover from overflow state
    else {
      const columnWidth = Math.floor(
        (minTableWidth - sourceCol.width) / (newState.cols.length - 1),
      );
      newState = {
        ...resizeState,
        cols: newState.cols.map(col => {
          if (col.index === sourceCol.index) {
            return col;
          }

          return { ...col, width: columnWidth };
        }),
      };
    }
  }

  // fix total table widths by adding missing pixels to columns widths here and there
  return adjustColumnsWidths(newState, resizeState.maxSize);
};

export const areColumnsEven = (resizeState: ResizeState): boolean => {
  const newResizeState = evenAllColumnsWidths(resizeState);
  return newResizeState.cols.every(
    (col, i) => col.width === resizeState.cols[i].width,
  );
};
