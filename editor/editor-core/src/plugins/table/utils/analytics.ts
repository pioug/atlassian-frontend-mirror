import { Selection } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable, getSelectionRect } from '@atlaskit/editor-tables/utils';

export function getSelectedTableInfo(selection: Selection) {
  let map;
  let totalRowCount = 0;
  let totalColumnCount = 0;

  const table = findTable(selection);
  if (table) {
    map = TableMap.get(table.node);
    totalRowCount = map.height;
    totalColumnCount = map.width;
  }

  return {
    table,
    map,
    totalRowCount,
    totalColumnCount,
  };
}

export function getSelectedCellInfo(selection: Selection) {
  let horizontalCells = 1;
  let verticalCells = 1;
  let totalCells = 1;

  const { table, map, totalRowCount, totalColumnCount } = getSelectedTableInfo(
    selection,
  );

  if (table && map) {
    const rect = getSelectionRect(selection);
    if (rect) {
      totalCells = map.cellsInRect(rect).length;
      horizontalCells = rect.right - rect.left;
      verticalCells = rect.bottom - rect.top;
    }
  }

  return {
    totalRowCount,
    totalColumnCount,
    horizontalCells,
    verticalCells,
    totalCells,
  };
}
