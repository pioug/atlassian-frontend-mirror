import { Node as PMNode, ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';

import { TableContext, TableMap } from '../table-map';

import { cloneTr } from './clone-tr';
import { findCellRectClosestToPos, findTable } from './find';
import { isTableSelected } from './is-selected';
import { isSelectionType } from './is-selection-type';
import { removeTable } from './remove-table';

function removeRow(
  tr: Transaction,
  { map, table, tableStart }: TableContext,
  rowIndex: number,
): Transaction {
  let rowPos = 0;
  for (let i = 0; i < rowIndex; i++) {
    rowPos += table.child(i).nodeSize;
  }
  let nextRow = rowPos + table.child(rowIndex).nodeSize;

  let mapFrom = tr.mapping.maps.length;
  tr.delete(rowPos + tableStart, nextRow + tableStart);

  for (
    let col = 0, index = rowIndex * map.width;
    col < map.width;
    col++, index++
  ) {
    let pos = map.map[index];
    if (rowIndex > 0 && pos === map.map[index - map.width]) {
      // If this cell starts in the row above, simply reduce its rowspan
      const cell = table.nodeAt(pos);
      if (!cell) {
        continue;
      }
      const attrs = cell.attrs;
      tr.setNodeMarkup(
        tr.mapping.slice(mapFrom).map(pos + tableStart),
        undefined,
        { ...attrs, rowspan: attrs.rowspan - 1 },
      );
      col += attrs.colspan - 1;
    } else if (rowIndex < map.width && pos === map.map[index + map.width]) {
      // Else, if it continues in the row below, it has to be moved down
      const cell = table.nodeAt(pos);
      if (!cell) {
        continue;
      }
      const copy = cell.type.create(
        { ...cell.attrs, rowspan: cell.attrs.rowspan - 1 },
        cell.content,
      );
      const newPos = map.positionAt(rowIndex + 1, col, table);
      tr.insert(tr.mapping.slice(mapFrom).map(tableStart + newPos), copy);
      col += cell.attrs.colspan - 1;
    }
  }

  return tr;
}

// Returns a new transaction that removes a row at index `rowIndex`. If there is only one row left, it will remove the entire table.
export const removeRowAt = (rowIndex: number) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);
    if (rowIndex === 0 && map.height === 1) {
      return removeTable(tr);
    } else if (rowIndex >= 0 && rowIndex <= map.height) {
      removeRow(
        tr,
        {
          map,
          tableStart: table.start,
          table: table.node,
        },
        rowIndex,
      );
      return cloneTr(tr);
    }
  }

  return tr;
};

// Returns a new transaction that removes selected rows.
export const removeSelectedRows = (tr: Transaction): Transaction => {
  const { selection } = tr;
  if (isTableSelected(selection)) {
    return removeTable(tr);
  }
  if (isSelectionType(selection, 'cell')) {
    const table = findTable(selection);
    if (table) {
      const map = TableMap.get(table.node);
      const rect = map.rectBetween(
        selection.$anchorCell.pos - table.start,
        selection.$headCell.pos - table.start,
      );

      if (rect.top === 0 && rect.bottom === map.height) {
        return tr;
      }

      const pmTableRect = {
        ...rect,
        map,
        table: table.node,
        tableStart: table.start,
      };

      for (let i = pmTableRect.bottom - 1; ; i--) {
        removeRow(tr, pmTableRect, i);
        if (i === pmTableRect.top) {
          break;
        }
        pmTableRect.table = pmTableRect.tableStart
          ? (tr.doc.nodeAt(pmTableRect.tableStart - 1) as PMNode)
          : tr.doc;
        pmTableRect.map = TableMap.get(pmTableRect.table);
      }

      return cloneTr(tr);
    }
  }

  return tr;
};

// Returns a new transaction that removes a row closest to a given `$pos`.
export const removeRowClosestToPos = ($pos: ResolvedPos) => (
  tr: Transaction,
): Transaction => {
  const rect = findCellRectClosestToPos($pos);
  if (rect) {
    return removeRowAt(rect.top)(setTextSelection($pos.pos)(tr));
  }
  return tr;
};
