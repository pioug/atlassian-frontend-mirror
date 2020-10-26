import { Node as PMNode, ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';

import { TableContext, TableMap } from '../table-map';

import { cloneTr } from './clone-tr';
import { removeColSpan } from './colspan';
import { findCellRectClosestToPos, findTable } from './find';
import { isTableSelected } from './is-selected';
import { isSelectionType } from './is-selection-type';
import { removeTable } from './remove-table';

function removeColumn(
  tr: Transaction,
  { map, table, tableStart }: TableContext,
  columnIndex: number,
): Transaction {
  const mapStart = tr.mapping.maps.length;

  for (let row = 0; row < map.height; ) {
    const index = row * map.width + columnIndex;
    const pos = map.map[index];
    const cell = table.nodeAt(pos);
    if (!cell) {
      continue;
    }

    // If this is part of a col-spanning cell
    if (
      (columnIndex > 0 && map.map[index - 1] === pos) ||
      (columnIndex < map.width - 1 && map.map[index + 1] === pos)
    ) {
      tr.setNodeMarkup(
        tr.mapping.slice(mapStart).map(tableStart + pos),
        undefined,
        removeColSpan(cell.attrs, columnIndex - map.colCount(pos)),
      );
    } else {
      const start = tr.mapping.slice(mapStart).map(tableStart + pos);
      tr.delete(start, start + cell.nodeSize);
    }

    row += cell.attrs.rowspan;
  }

  return tr;
}

// Returns a new transaction that removes a column at index `columnIndex`. If there is only one column left, it will remove the entire table.
export const removeColumnAt = (columnIndex: number) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);
    if (columnIndex === 0 && map.width === 1) {
      return removeTable(tr);
    } else if (columnIndex >= 0 && columnIndex <= map.width) {
      removeColumn(
        tr,
        {
          map,
          tableStart: table.start,
          table: table.node,
        },
        columnIndex,
      );
      return cloneTr(tr);
    }
  }

  return tr;
};

// Returns a new transaction that removes selected columns.
export const removeSelectedColumns = (tr: Transaction): Transaction => {
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

      if (rect.left === 0 && rect.right === map.width) {
        return tr;
      }

      const pmTableRect = {
        ...rect,
        map,
        table: table.node,
        tableStart: table.start,
      };

      for (let i = pmTableRect.right - 1; ; i--) {
        removeColumn(tr, pmTableRect, i);
        if (i === pmTableRect.left) {
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

// Returns a new transaction that removes a column closest to a given `$pos`.
export const removeColumnClosestToPos = ($pos: ResolvedPos) => (
  tr: Transaction,
): Transaction => {
  const rect = findCellRectClosestToPos($pos);
  if (rect) {
    return removeColumnAt(rect.left)(setTextSelection($pos.pos)(tr));
  }
  return tr;
};
