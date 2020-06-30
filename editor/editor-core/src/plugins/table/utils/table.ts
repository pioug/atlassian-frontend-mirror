import { Transaction } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { findTable } from 'prosemirror-utils';

export const getMergedCellsPositions = (tr: Transaction): number[] => {
  const table = findTable(tr.selection);
  if (!table) {
    return [];
  }

  const map = TableMap.get(table.node);
  const cellPositions = new Set();
  const mergedCells: number[] = [];

  map.map.forEach(value => {
    if (cellPositions.has(value)) {
      mergedCells.push(value);
    } else {
      cellPositions.add(value);
    }
  });

  return mergedCells;
};
