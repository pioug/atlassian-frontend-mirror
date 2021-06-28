import { Node as PMNode } from 'prosemirror-model';
import { Selection, Transaction } from 'prosemirror-state';
import { TableMap, Rect } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';

import { CellAttributes } from '@atlaskit/adf-schema';
import { AddColumnStep } from '@atlaskit/adf-schema/steps';

import { setMeta } from './metadata';
import { splitCellsInColumns } from './split';

const deleteColumnsCustomStep = (rect: Rect) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection);
  if (!table) {
    return tr;
  }

  // Need to split all the merge in the ranges (this is the current behaviour)
  // Maybe is better to split only the last column?
  // TODO: After talking with Roto about this behaviour, he likes when we dont split the columns, I am keeping this for consistency of the current implementation.
  splitCellsInColumns(tr, table.pos, rect.left, rect.right);

  // Delete the columns
  let mapStart = tr.mapping.maps.length;
  const originalDoc = tr.doc;
  const deletedColumns = [];
  for (let i = rect.left; i < rect.right; i++) {
    const step = AddColumnStep.create(originalDoc, table.pos, i, true);
    deletedColumns.push(i);
    tr.step(step.map(tr.mapping.slice(mapStart))!);
  }

  const tablePosResult = tr.mapping.mapResult(table.pos);
  if (tablePosResult.deleted) {
    const pos = Math.min(tablePosResult.pos, tr.doc.nodeSize - 1);
    tr.setSelection(Selection.near(tr.doc.resolve(pos)));
  } else {
    const newTable = tr.doc.nodeAt(tablePosResult.pos);
    if (newTable) {
      const cursorPos = getNextCursorPos(newTable, deletedColumns);
      tr.setSelection(Selection.near(tr.doc.resolve(table.pos + cursorPos)));
    }
  }

  return tr;
};

const deleteColumnsLegacy = (rect: Rect) => (tr: Transaction): Transaction => {
  const table = findTable(tr.selection);
  if (!table) {
    return tr;
  }

  const columnsToDelete: number[] = [];
  for (let i = rect.left; i < rect.right; i++) {
    columnsToDelete.push(i);
  }

  if (!columnsToDelete.length) {
    return tr;
  }

  const map = TableMap.get(table.node);
  const rows: PMNode[] = [];
  const seen: { [key: string]: boolean } = {};
  const deletedCells: { [key: string]: boolean } = {};

  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const rowCells: PMNode[] = [];
    const row = table.node.child(rowIndex);

    for (let colIndex = 0; colIndex < map.width; colIndex++) {
      const cellPos = map.map[rowIndex * map.width + colIndex];
      const cell = table.node.nodeAt(cellPos);
      if (!cell) {
        continue;
      }
      const cellsInColumn = map.cellsInRect({
        left: colIndex,
        top: 0,
        right: colIndex + 1,
        bottom: map.height,
      });
      if (columnsToDelete.indexOf(colIndex) === -1) {
        // decrement colspans for col-spanning cells that overlap deleted columns
        if (cellsInColumn.indexOf(cellPos) > -1 && !seen[cellPos]) {
          let overlappingCols = 0;
          columnsToDelete.forEach((colIndexToDelete) => {
            if (
              colIndex < colIndexToDelete &&
              cell.attrs.colspan + colIndex - 1 >= colIndexToDelete
            ) {
              overlappingCols += 1;
            }
          });
          if (overlappingCols > 0) {
            const attrs: CellAttributes = {
              ...cell.attrs,
              colspan: cell.attrs.colspan - overlappingCols,
            };
            if (cell.attrs.colwidth) {
              const minColIndex = Math.min(...columnsToDelete);
              const pos =
                minColIndex > 0 ? minColIndex - map.colCount(cellPos) : 0;
              const colwidth = cell.attrs.colwidth.slice() || [];
              colwidth.splice(pos, overlappingCols);
              attrs.colwidth = colwidth;
            }
            const newCell = cell.type.createChecked(
              attrs,
              cell.content,
              cell.marks,
            );
            rowCells.push(newCell);
            seen[cellPos] = true;
            continue;
          }
        } else if (deletedCells[cellPos]) {
          // if we're removing a col-spanning cell, we need to add missing cells to columns to the right
          const attrs: CellAttributes = {
            ...cell.attrs,
            colspan: 1,
            rowspan: 1,
          };
          if (cell.attrs.colwidth) {
            const pos = colIndex > 0 ? colIndex - map.colCount(cellPos) : 0;
            attrs.colwidth = cell.attrs.colwidth.slice().splice(pos, 1);
          }
          const newCell = cell.type.createChecked(
            attrs,
            cell.type.schema.nodes.paragraph.createChecked(),
            cell.marks,
          );
          rowCells.push(newCell);
          continue;
        }

        // normal cells that we want to keep
        if (!seen[cellPos]) {
          seen[cellPos] = true;
          rowCells.push(cell);
        }
      } else if (cellsInColumn.indexOf(cellPos) > -1) {
        deletedCells[cellPos] = true;
      }
    }

    if (rowCells.length) {
      rows.push(row.type.createChecked(row.attrs, rowCells, row.marks));
    }
  }

  if (!rows.length) {
    return setMeta({ type: 'DELETE_COLUMNS', problem: 'EMPTY_TABLE' })(tr);
  }

  const newTable = table.node.type.createChecked(
    table.node.attrs,
    rows,
    table.node.marks,
  );

  const fixedTable = fixRowSpans(newTable);
  if (fixedTable === null) {
    return setMeta({ type: 'DELETE_COLUMNS', problem: 'FIX_ROWSPANS' })(tr);
  }

  const cursorPos = getNextCursorPos(newTable, columnsToDelete);

  return setMeta({ type: 'DELETE_COLUMNS' })(
    tr
      .replaceWith(table.pos, table.pos + table.node.nodeSize, fixedTable)
      // move cursor to the left of the deleted columns if possible, otherwise - to the first column
      .setSelection(Selection.near(tr.doc.resolve(table.pos + cursorPos))),
  );
};

function getNextCursorPos(table: PMNode, deletedColumns: number[]): number {
  const minColumn = Math.min(...deletedColumns);
  const nextColumnWithCursor = minColumn > 0 ? minColumn - 1 : 0;
  const map = TableMap.get(table);
  return map.map[nextColumnWithCursor];
}

// returns an array of numbers, each number indicates the minimum rowSpan in each row
function getMinRowSpans(table: PMNode): number[] {
  const minRowSpans: number[] = [];
  for (let rowIndex = 0; rowIndex < table.childCount; rowIndex++) {
    const rowSpans: number[] = [];
    const row = table.child(rowIndex);
    for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
      const cell = row.child(colIndex);
      rowSpans.push(cell.attrs.rowspan);
    }
    minRowSpans[rowIndex] = Math.min(...rowSpans);
  }

  return minRowSpans;
}

function fixRowSpans(table: PMNode): PMNode | null {
  const map = TableMap.get(table);
  const minRowSpans = getMinRowSpans(table);
  if (!minRowSpans.some((rowspan) => rowspan > 1)) {
    return table;
  }

  const rows: PMNode[] = [];
  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const row = table.child(rowIndex);
    if (minRowSpans[rowIndex] === 1) {
      rows.push(row);
    } else {
      const rowCells: PMNode[] = [];
      for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
        const cell = row.child(colIndex);
        const rowspan = cell.attrs.rowspan - minRowSpans[rowIndex] + 1;
        if (rowspan < 1) {
          return null;
        }
        const newCell = cell.type.createChecked(
          {
            ...cell.attrs,
            rowspan,
          },
          cell.content,
          cell.marks,
        );
        rowCells.push(newCell);
      }
      rows.push(row.type.createChecked(row.attrs, rowCells, row.marks));
    }
  }

  if (!rows.length) {
    return null;
  }

  return table.type.createChecked(table.attrs, rows, table.marks);
}

export const deleteColumns = (rect: Rect, allowAddColumnCustomStep = false) => (
  tr: Transaction,
): Transaction => {
  if (allowAddColumnCustomStep) {
    return deleteColumnsCustomStep(rect)(tr);
  }
  return deleteColumnsLegacy(rect)(tr);
};
