import { Transaction } from 'prosemirror-state';

import { SelectionRange } from '../types';

import { getCellsInColumn } from './get-cells-in-column';
import { getCellsInRow } from './get-cells-in-row';

// Returns a range of rectangular selection spanning all merged cells around a column at index `columnIndex`.
export const getSelectionRangeInColumn = (columnIndex: number) => (
  tr: Transaction,
): SelectionRange | undefined => {
  let startIndex = columnIndex;
  let endIndex = columnIndex;

  // looking for selection start column (startIndex)
  for (let i = columnIndex; i >= 0; i--) {
    const cells = getCellsInColumn(i)(tr.selection);
    if (cells) {
      cells.forEach((cell) => {
        let maybeEndIndex = cell.node.attrs.colspan + i - 1;
        if (maybeEndIndex >= startIndex) {
          startIndex = i;
        }
        if (maybeEndIndex > endIndex) {
          endIndex = maybeEndIndex;
        }
      });
    }
  }
  // looking for selection end column (endIndex)
  for (let i = columnIndex; i <= endIndex; i++) {
    const cells = getCellsInColumn(i)(tr.selection);
    if (cells) {
      cells.forEach((cell) => {
        let maybeEndIndex = cell.node.attrs.colspan + i - 1;
        if (cell.node.attrs.colspan > 1 && maybeEndIndex > endIndex) {
          endIndex = maybeEndIndex;
        }
      });
    }
  }

  // filter out columns without cells (where all rows have colspan > 1 in the same column)
  const indexes = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const maybeCells = getCellsInColumn(i)(tr.selection);
    if (maybeCells && maybeCells.length) {
      indexes.push(i);
    }
  }
  startIndex = indexes[0];
  endIndex = indexes[indexes.length - 1];

  const firstSelectedColumnCells = getCellsInColumn(startIndex)(tr.selection);
  const firstRowCells = getCellsInRow(0)(tr.selection);
  if (!firstSelectedColumnCells || !firstRowCells) {
    return;
  }

  const $anchor = tr.doc.resolve(
    firstSelectedColumnCells[firstSelectedColumnCells.length - 1].pos,
  );

  let headCell;
  for (let i = endIndex; i >= startIndex; i--) {
    const columnCells = getCellsInColumn(i)(tr.selection);
    if (columnCells && columnCells.length) {
      for (let j = firstRowCells.length - 1; j >= 0; j--) {
        if (firstRowCells[j].pos === columnCells[0].pos) {
          headCell = columnCells[0];
          break;
        }
      }
      if (headCell) {
        break;
      }
    }
  }
  if (!headCell) {
    return;
  }

  const $head = tr.doc.resolve(headCell.pos);
  return { $anchor, $head, indexes };
};
