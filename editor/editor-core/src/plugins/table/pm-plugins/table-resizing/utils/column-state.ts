import { Node as PMNode } from 'prosemirror-model';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findDomRefAtPos } from 'prosemirror-utils';

import { tableNewColumnMinWidth } from '@atlaskit/editor-common';

import { contentWidth } from './content-width';
import { unitToNumber } from './unit-to-number';

export interface ColumnState {
  index: number;
  width: number;
  minWidth: number;
}

// Reads `width` and `minWidth` of each column from DOM and returns `ColumnState` containing those values
export const getColumnStateFromDOM = (
  cells: HTMLElement[],
  index: number,
  minWidth: number,
): ColumnState => {
  const width = calculateColumnWidth(cells, calculateColumnWidthCallback);

  const minColumnWidth =
    width < minWidth
      ? // for newly created column (where width < minWidth) we set minWidth = tableNewColumnMinWidth (140px atm)
        tableNewColumnMinWidth
      : calculateColumnWidth(cells, calculateColumnMinWidthCallback(minWidth));

  return {
    index,
    width: width < minWidth ? tableNewColumnMinWidth : width,
    minWidth: minColumnWidth,
  };
};

export const getFreeSpace = (state: ColumnState) => {
  return Math.max(state.width - state.minWidth, 0);
};

// Returns DOM refs of all cells in a column by `columnIndex`
export const getCellsRefsInColumn = (
  columnIndex: number,
  table: PMNode,
  tableStart: number,
  domAtPos: (pos: number) => { node: Node; offset: number },
): HTMLElement[] => {
  const map = TableMap.get(table);
  const cellsPositions = map.cellsInRect({
    left: columnIndex,
    right: columnIndex + 1,
    top: 0,
    bottom: map.height,
  });
  const cells: HTMLElement[] = [];
  cellsPositions.forEach((pos) => {
    const col = findDomRefAtPos(pos + tableStart, domAtPos) as HTMLElement;
    if (col) {
      cells.push(col);
    }
  });
  return cells;
};

// calculates column withs based on `cells` DOM refs
export const calculateColumnWidth = (
  cells: HTMLElement[],
  calculateColumnWidthCb: (
    css: CSSStyleDeclaration,
    cellRef: HTMLElement,
    colSpan: number,
  ) => number,
): number => {
  let maxColWidth = 0;
  let colSpanWidth = 0;

  cells.forEach((cellRef) => {
    const css = getComputedStyle(cellRef);
    const colspan = Number(cellRef.getAttribute('colspan') || 1);

    if (colspan > 1) {
      colSpanWidth = calculateColumnWidthCb(css, cellRef, colspan);
      return;
    }

    if (css) {
      const colWidth = calculateColumnWidthCb(css, cellRef, colspan);
      maxColWidth = Math.max(colWidth, maxColWidth);
    }
  });

  return maxColWidth || colSpanWidth;
};

export const addContainerLeftRightPadding = (
  amount: number,
  css: CSSStyleDeclaration,
): number =>
  amount + unitToNumber(css.paddingLeft) + unitToNumber(css.paddingRight);

function calculateColumnWidthCallback(css: CSSStyleDeclaration): number {
  return unitToNumber(css.width);
}

function calculateColumnMinWidthCallback(
  minColumnWidth: number,
): (css: CSSStyleDeclaration, cellRef: HTMLElement, colSpan: number) => number {
  return (css, cellRef, colSpan) => {
    if (colSpan && colSpan > 1) {
      return unitToNumber(css.width);
    }

    const { minWidth: minContentWidth } = contentWidth(cellRef, cellRef);
    // Override the min width, if there is content that can't collapse
    // Past a certain width.
    return Math.max(
      addContainerLeftRightPadding(minContentWidth, css),
      minContentWidth,
      minColumnWidth,
    );
  };
}
