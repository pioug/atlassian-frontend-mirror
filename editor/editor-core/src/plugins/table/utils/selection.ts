import { Transaction, Selection } from 'prosemirror-state';
import { CellSelection, TableMap, Rect } from 'prosemirror-tables';
import {
  findTable,
  isCellSelection,
  getSelectionRect,
  getSelectionRangeInColumn,
  getSelectionRangeInRow,
} from 'prosemirror-utils';

export const isSelectionUpdated = (
  oldSelection: Selection,
  newSelection?: Selection,
) =>
  !!(!newSelection && oldSelection) ||
  isCellSelection(oldSelection) !== isCellSelection(newSelection!) ||
  (isCellSelection(oldSelection) &&
    isCellSelection(newSelection!) &&
    oldSelection.ranges !== newSelection!.ranges);

const isRectangularCellSelection = (
  selection: Selection,
  rect: Rect,
): boolean => {
  const table = findTable(selection);
  if (!table) {
    return true;
  }
  const { width, height, map } = TableMap.get(table.node);

  let indexTop = rect.top * width + rect.left;
  let indexLeft = indexTop;
  let indexBottom = (rect.bottom - 1) * width + rect.left;
  let indexRight = indexTop + (rect.right - rect.left - 1);

  for (let i = rect.top; i < rect.bottom; i++) {
    if (
      (rect.left > 0 && map[indexLeft] === map[indexLeft - 1]) ||
      (rect.right < width && map[indexRight] === map[indexRight + 1])
    ) {
      return false;
    }
    indexLeft += width;
    indexRight += width;
  }
  for (let i = rect.left; i < rect.right; i++) {
    if (
      (rect.top > 0 && map[indexTop] === map[indexTop - width]) ||
      (rect.bottom < height && map[indexBottom] === map[indexBottom + width])
    ) {
      return false;
    }
    indexTop++;
    indexBottom++;
  }

  return true;
};

export const normalizeSelection = (tr: Transaction): Transaction => {
  const { selection } = tr;
  const rect = getSelectionRect(selection);

  if (
    !rect ||
    !(selection instanceof CellSelection) ||
    isRectangularCellSelection(selection, rect)
  ) {
    return tr;
  }

  if (selection.isColSelection()) {
    const { $anchor } = getSelectionRangeInColumn(rect.left)(tr);
    const { $head } = getSelectionRangeInColumn(rect.right - 1)(tr);
    return tr.setSelection(new CellSelection($anchor, $head) as any);
  }

  if (selection.isRowSelection()) {
    const { $anchor } = getSelectionRangeInRow(rect.top)(tr);
    const { $head } = getSelectionRangeInRow(rect.bottom - 1)(tr);
    return tr.setSelection(new CellSelection($anchor, $head) as any);
  }

  return tr;
};

export const getSelectedColumnIndexes = (selectionRect: Rect): number[] => {
  const columnIndexes: number[] = [];
  for (let i = selectionRect.left; i < selectionRect.right; i++) {
    columnIndexes.push(i);
  }
  return columnIndexes;
};

export const getSelectedRowIndexes = (selectionRect: Rect): number[] => {
  const rowIndexes: number[] = [];
  for (let i = selectionRect.top; i < selectionRect.bottom; i++) {
    rowIndexes.push(i);
  }
  return rowIndexes;
};
