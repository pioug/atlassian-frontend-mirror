import { Selection, Transaction } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';

import { cloneTr } from './clone-tr';
import { getCellsInColumn } from './get-cells-in-column';
import { getCellsInRow } from './get-cells-in-row';

// Returns a new transaction that maps a given `cellTransform` function to each cell in a column at a given `columnIndex`.
// It will set the selection into the last cell of the column if `setCursorToLastCell` param is set to `true`.
export const forEachCellInColumn = (
  columnIndex: number,
  cellTransform: (cell: ContentNodeWithPos, tr: Transaction) => Transaction,
  setCursorToLastCell?: boolean,
) => (tr: Transaction): Transaction => {
  const cells = getCellsInColumn(columnIndex)(tr.selection);
  if (cells) {
    for (let i = cells.length - 1; i >= 0; i--) {
      tr = cellTransform(cells[i], tr);
    }
    if (setCursorToLastCell) {
      const $pos = tr.doc.resolve(tr.mapping.map(cells[cells.length - 1].pos));
      tr.setSelection(Selection.near($pos));
    }
    return cloneTr(tr);
  }

  return tr;
};

// Returns a new transaction that maps a given `cellTransform` function to each cell in a row at a given `rowIndex`.
// It will set the selection into the last cell of the row if `setCursorToLastCell` param is set to `true`.
export const forEachCellInRow = (
  rowIndex: number,
  cellTransform: (cell: ContentNodeWithPos, tr: Transaction) => Transaction,
  setCursorToLastCell: boolean,
) => (tr: Transaction): Transaction => {
  const cells = getCellsInRow(rowIndex)(tr.selection);
  if (cells) {
    for (let i = cells.length - 1; i >= 0; i--) {
      tr = cellTransform(cells[i], tr);
    }
    if (setCursorToLastCell) {
      const $pos = tr.doc.resolve(tr.mapping.map(cells[cells.length - 1].pos));
      tr.setSelection(Selection.near($pos));
    }
  }

  return tr;
};
