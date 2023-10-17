import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables';
import { findTable, TableMap } from '@atlaskit/editor-tables';

const hasMergedCells =
  (
    indexes: number | number[],
    normalizeRect: (index: number, map: TableMap) => Rect,
  ) =>
  (selection: Selection): boolean => {
    const table = findTable(selection);
    if (!table) {
      return false;
    }

    const map = TableMap.get(table.node);
    const cellPositions = new Set<number>();
    const mergedCells = new Set<number>();

    map.map.forEach((value) => {
      if (cellPositions.has(value)) {
        mergedCells.add(value);
      } else {
        cellPositions.add(value);
      }
    });

    if (!mergedCells.size) {
      return false;
    }

    return (Array.isArray(indexes) ? indexes : [indexes])
      .map((index) => normalizeRect(index, map))
      .filter((rect) => rect.left < rect.right && rect.top < rect.bottom)
      .some((rect) => {
        const n = (rect.right - rect.left) * (rect.bottom - rect.top);
        const cells = map.cellsInRect(rect);
        if (cells.length !== n) {
          // We can quickly assume that if the amount of cells from the map is different to what the rect says
          // then there is most likely merged cells across this area which is removing cells
          return true;
        }
        return cells.some((nodePos) => mergedCells.has(nodePos));
      });
  };

export const hasMergedCellsInColumn = (columnIndexes: number | number[]) =>
  hasMergedCells(columnIndexes, (index: number, map: TableMap) => {
    const x = Math.max(Math.min(index, map.width - 1), 0); // clamped index
    return {
      left: x,
      right: x === index ? x + 1 : x,
      top: 0,
      bottom: map.height,
    };
  });

export const hasMergedCellsInRow = (rowIndexes: number | number[]) =>
  hasMergedCells(rowIndexes, (index: number, map: TableMap) => {
    const y = Math.max(Math.min(index, map.height - 1), 0); // clamped index
    return {
      left: 0,
      right: map.width,
      top: y,
      bottom: y === index ? y + 1 : y,
    };
  });
