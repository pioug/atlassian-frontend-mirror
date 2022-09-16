import { Transaction } from 'prosemirror-state';
import { TableMap, Rect } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';

export const getMergedCellsPositions = (tr: Transaction): number[] => {
  const table = findTable(tr.selection);
  if (!table) {
    return [];
  }

  const map = TableMap.get(table.node);
  const cellPositions = new Set();
  const mergedCells: number[] = [];

  map.map.forEach((value) => {
    if (cellPositions.has(value)) {
      mergedCells.push(value);
    } else {
      cellPositions.add(value);
    }
  });

  return mergedCells;
};

export const colsToRect = (cols: Array<number>, noOfRows: number): Rect => ({
  left: Math.min(...cols),
  right: Math.max(...cols) + 1,
  top: 0,
  bottom: noOfRows,
});
