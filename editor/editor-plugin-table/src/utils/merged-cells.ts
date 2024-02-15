import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables';
import { findTable, TableMap } from '@atlaskit/editor-tables';

type MergeType = 'row' | 'column';

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

const getRect = (index: number, type: MergeType, map: TableMap) => {
  if (type === 'column') {
    const x = Math.max(Math.min(index, map.width - 1), 0); // clamped index
    return {
      left: x,
      right: x === index ? x + 1 : x,
      top: 0,
      bottom: map.height,
    };
  } else {
    const y = Math.max(Math.min(index, map.height - 1), 0); // clamped index
    return {
      left: 0,
      right: map.width,
      top: y,
      bottom: y === index ? y + 1 : y,
    };
  }
};

export const hasMergedCellsInBetween =
  (indexes: number[], type: MergeType) =>
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

    const getMergedCellsInRect = (index: number, type: MergeType) => {
      const rect = getRect(index, type, map);
      const isValidRectangle = rect.left < rect.right && rect.top < rect.bottom;
      if (!isValidRectangle) {
        return [];
      }

      const cells = map.cellsInRect(rect);

      let allCellsInRect = [];
      if (type === 'column') {
        allCellsInRect = map.map.filter((_, key) => key % map.width === index);
      } else {
        allCellsInRect = map.map.filter(
          (_, key) => Math.floor(key / map.width) === index,
        );
      }
      const mergedCell = allCellsInRect.filter((nodePos) => {
        return !cells.includes(nodePos) // cell exists in Rect but not show in the map.cellsInRect list => merged cell
          ? true
          : mergedCells.has(nodePos); // cell includes in mergedCells => merged cell
      });

      return [...new Set(mergedCell)];
    };

    const mergedCellsInRectArr = indexes.map((index) =>
      getMergedCellsInRect(index, type),
    );

    // Currently only support 2 indexes, but we can extend this to support more indexes in the future.
    return mergedCellsInRectArr[0].some((cell) =>
      mergedCellsInRectArr[1].includes(cell),
    );
  };

// Checks if any cell in the column with colIndex is merged with a cell in a column to the left or to the right of it.
// colIndex is a logical index of the column. It starts at 0 and goes up to tableMap.width - 1.
export const hasMergedCellsWithColumnNextToColumnIndex = (
  colIndex: number,
  selection: Selection,
) => {
  const table = findTable(selection);
  if (!table) {
    return false;
  }

  const tableMap = TableMap.get(table.node);
  const { width } = tableMap;
  if (width <= 1) {
    return false;
  }

  if (colIndex < 0 || colIndex > width - 1) {
    return false;
  }

  const { map } = tableMap;
  // j is an index in the tableMap.map array. tableMap.map is a flat array.
  // Each item of this array contains a number.
  // The number represents the position of the corresponding cell in the tableMap. It exists for each cell.
  // If there are merged cells, their positions will be represented by the same number.
  const isFirstColumn = colIndex === 0;
  const isLastColumn = colIndex === width - 1;
  for (let j = colIndex; j < map.length; j += width) {
    if (
      (!isFirstColumn && map[j] === map[j - 1]) || // compare with a cell in the column on the left
      (!isLastColumn && map[j] === map[j + 1]) // compare with a cell in the column on the right
    ) {
      return true;
    }
  }

  return false;
};

// Checks if any cell in the row with rowIndex is merged with a cell in a row above or below it.
export const hasMergedCellsWithRowNextToRowIndex = (
  rowIndex: number, // logical row index in the table. It starts at 0 and goes up to tableMap.height - 1.
  selection: Selection,
) => {
  const table = findTable(selection);
  if (!table) {
    return false;
  }

  const tableMap = TableMap.get(table.node);
  const { height } = tableMap;
  if (height <= 1) {
    return false;
  }

  if (rowIndex < 0 || rowIndex > height - 1) {
    return false;
  }

  const { map, width } = tableMap; // map is a flat array representing position of each cell in the table.
  const indexOfFirstCellInTheRow = rowIndex * width;
  const indexOfLastCellInTheRow = indexOfFirstCellInTheRow + width - 1;
  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === height - 1;
  // j is an index of a cell in a row
  for (let j = indexOfFirstCellInTheRow; j <= indexOfLastCellInTheRow; j++) {
    if (
      (!isFirstRow && map[j] === map[j - width]) || // compare with a cell in the row above
      (!isLastRow && map[j] === map[j + width]) // compare with a cell in the row below
    ) {
      return true;
    }
  }

  return false;
};
