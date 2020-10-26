import { Transaction } from 'prosemirror-state';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';

import { cloneTr } from './clone-tr';
import { findCellClosestToPos, findTable } from './find';

const select = (type: 'row' | 'column') => (
  index: number,
  expand?: boolean,
) => (tr: Transaction): Transaction => {
  const table = findTable(tr.selection);
  const isRowSelection = type === 'row';
  if (table) {
    const map = TableMap.get(table.node);

    // Check if the index is valid
    if (index >= 0 && index < (isRowSelection ? map.height : map.width)) {
      let left = isRowSelection ? 0 : index;
      let top = isRowSelection ? index : 0;
      let right = isRowSelection ? map.width : index + 1;
      let bottom = isRowSelection ? index + 1 : map.height;

      if (expand) {
        const cell = findCellClosestToPos(tr.selection.$from);
        if (!cell) {
          return tr;
        }

        const selRect = map.findCell(cell.pos - table.start);
        if (isRowSelection) {
          top = Math.min(top, selRect.top);
          bottom = Math.max(bottom, selRect.bottom);
        } else {
          left = Math.min(left, selRect.left);
          right = Math.max(right, selRect.right);
        }
      }

      const cellsInFirstRow = map.cellsInRect({
        left,
        top,
        right: isRowSelection ? right : left + 1,
        bottom: isRowSelection ? top + 1 : bottom,
      });

      const cellsInLastRow =
        bottom - top === 1
          ? cellsInFirstRow
          : map.cellsInRect({
              left: isRowSelection ? left : right - 1,
              top: isRowSelection ? bottom - 1 : top,
              right,
              bottom,
            });

      const head = table.start + cellsInFirstRow[0];
      const anchor = table.start + cellsInLastRow[cellsInLastRow.length - 1];
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
    }
  }

  return tr;
};

// Returns a new transaction that selects a column at index `columnIndex`.
// Use the optional `expand` param to extend from current selection.
export const selectColumn = select('column');

// Returns a new transaction that selects a row at index `rowIndex`.
// Use the optional `expand` param to extend from current selection.
export const selectRow = select('row');

// Returns a new transaction that selects a table.
export const selectTable = (tr: Transaction): Transaction => {
  const table = findTable(tr.selection);
  if (table) {
    const { map } = TableMap.get(table.node);
    if (map && map.length) {
      const head = table.start + map[0];
      const anchor = table.start + map[map.length - 1];
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
    }
  }

  return tr;
};
