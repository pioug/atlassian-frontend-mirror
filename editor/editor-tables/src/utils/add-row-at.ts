import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { ContentNodeWithPos, safeInsert } from 'prosemirror-utils';

import { TableMap } from '../table-map';

import { addRow } from './add-row';
import { cloneTr } from './clone-tr';
import { findTable } from './find';
import { getCellsInRow } from './get-cells-in-row';
import { setCellAttrs } from './set-cell-attrs';
import { tableNodeTypes } from './table-node-types';

type CellFilter = (cell: ContentNodeWithPos, tr: Transaction) => boolean;

const filterCellsInRow = (rowIndex: number, predicate: CellFilter) => (
  tr: Transaction,
): ContentNodeWithPos[] => {
  let foundCells = [];
  const cells = getCellsInRow(rowIndex)(tr.selection);
  if (cells) {
    for (let j = cells.length - 1; j >= 0; j--) {
      if (predicate(cells[j], tr)) {
        foundCells.push(cells[j]);
      }
    }
  }

  return foundCells;
};

// Returns a new transaction that adds a new row after `cloneRowIndex`, cloning the row attributes at `cloneRowIndex`.
export const cloneRowAt = (rowIndex: number) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);

    if (rowIndex >= 0 && rowIndex <= map.height) {
      const tableNode = table.node;
      const tableNodes = tableNodeTypes(tableNode.type.schema);

      let rowPos = table.start;
      for (let i = 0; i < rowIndex + 1; i++) {
        rowPos += tableNode.child(i).nodeSize;
      }

      const cloneRow = tableNode.child(rowIndex);
      // Re-create the same nodes with same attrs, dropping the node content.
      let cells: PMNode[] = [];
      let rowWidth = 0;

      cloneRow.forEach((cell) => {
        // If we're copying a row with rowspan somewhere, we dont want to copy that cell
        // We'll increment its span below.
        if (cell.attrs.rowspan === 1) {
          rowWidth += cell.attrs.colspan;
          const node = tableNodes[cell.type.spec.tableRole].createAndFill(
            cell.attrs,
            [],
            cell.marks,
          );
          if (node) {
            cells.push(node);
          }
        }
      });

      // If a higher row spans past our clone row, bump the higher row to cover this new row too.
      if (rowWidth < map.width) {
        let rowSpanCells = [];
        for (let i = rowIndex; i >= 0; i--) {
          let foundCells = filterCellsInRow(
            i,
            (cell: ContentNodeWithPos, tr: Transaction) => {
              const rowspan = cell.node.attrs.rowspan;
              const spanRange = i + rowspan;
              return rowspan > 1 && spanRange > rowIndex;
            },
          )(tr);
          rowSpanCells.push(...foundCells);
        }

        if (rowSpanCells.length) {
          rowSpanCells.forEach((cell) => {
            tr = setCellAttrs(cell, {
              rowspan: cell.node.attrs.rowspan + 1,
            })(tr);
          });
        }
      }

      return safeInsert(
        tableNodes.row.create(cloneRow.attrs, cells),
        rowPos,
      )(tr);
    }
  }

  return tr;
};

// Returns a new transaction that adds a new row at index `rowIndex`. Optionally clone the previous row.
export const addRowAt = (rowIndex: number, clonePreviousRow?: boolean) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection);
  if (table) {
    const map = TableMap.get(table.node);
    const cloneRowIndex = rowIndex - 1;

    if (clonePreviousRow && cloneRowIndex >= 0) {
      return cloneTr(cloneRowAt(cloneRowIndex)(tr));
    }

    if (rowIndex >= 0 && rowIndex <= map.height) {
      return cloneTr(
        addRow(
          tr,
          {
            map,
            tableStart: table.start,
            table: table.node,
          },
          rowIndex,
        ),
      );
    }
  }

  return tr;
};
