import { Selection } from 'prosemirror-state';

import { Rect, TableMap } from '../table-map';

import { isSelectionType } from './is-selection-type';

// Checks if a given CellSelection rect is selected
export const isRectSelected = (rect: Rect) => (
  selection: Selection,
): boolean => {
  if (!isSelectionType(selection, 'cell')) {
    return false;
  }

  const map = TableMap.get(selection.$anchorCell.node(-1));
  const start = selection.$anchorCell.start(-1);
  const cells = map.cellsInRect(rect);
  const selectedCells = map.cellsInRect(
    map.rectBetween(
      selection.$anchorCell.pos - start,
      selection.$headCell.pos - start,
    ),
  );

  for (let i = 0, count = cells.length; i < count; i++) {
    if (selectedCells.indexOf(cells[i]) === -1) {
      return false;
    }
  }

  return true;
};

// Checks if entire column at index `columnIndex` is selected.
export const isColumnSelected = (columnIndex: number) => (
  selection: Selection,
): boolean => {
  if (isSelectionType(selection, 'cell')) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: columnIndex,
      right: columnIndex + 1,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

// Checks if entire row at index `rowIndex` is selected.
export const isRowSelected = (rowIndex: number) => (
  selection: Selection,
): boolean => {
  if (isSelectionType(selection, 'cell')) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: 0,
      right: map.width,
      top: rowIndex,
      bottom: rowIndex + 1,
    })(selection);
  }

  return false;
};

// Checks if entire table is selected
export const isTableSelected = (selection: Selection): boolean => {
  if (isSelectionType(selection, 'cell')) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};
