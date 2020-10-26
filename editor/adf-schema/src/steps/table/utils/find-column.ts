import { TableRect } from '@atlaskit/editor-tables/table-map';
import { CellStep, ColumnInfo } from '../types';

/**
 * Try to find the right column based on the cell steps in column info..
 * @param columnInfo  - Map of cell positions sorted from lower to greather
 * @param rect - map rect
 */
export function findColumn(
  columnInfo: ColumnInfo,
  rect: TableRect,
): number | null {
  /**
   * Algorithm explained
   * Given a table like this:
   *    | 5  | 10      |
   *    | 15      | 20 |
   *    | 25 | 30 | 35 |
   * Represented by a table map like this:
   *   rect.map = [5, 10, 10,
   *              15, 15, 20,
   *              25, 30, 35]
   * And a have this inputs:
   *   columnInfo[].from = [10, 15, 30]
   *
   * Algorithm:
   *    * Initial state
   *      start = 0;
   *      end = 2 (rect.width - 1 === 3 - 1)
   *    * Iterate until find first cell position
   *      start = 1
   *      end = 2 (min(start column + colspan - 1, start column + end column))
   *    * Iterate until find second cell position
   *      start = 1
   *      end = 1
   *    * Start === end return 1
   */

  // Initial range (start and end column) to search for each row
  let [start, end] = [0, rect.map.width - 1];

  const iter = columnInfo.values();
  let next = iter.next();

  // Iterate for each row
  for (let row = 0; row < rect.map.height; row++) {
    if (next.done) {
      break;
    }
    // Iterate for the column. Starting with the current start range
    for (let col = start; col <= end; col++) {
      const i = row * rect.map.width + col;
      const cell = rect.map.map[i];
      const cellInfo = (next.value as CellStep).from - rect.tableStart;

      // When cell is found update range with the new values
      if (cell === cellInfo) {
        start = col; // Start column will be the current column
        // Try to find the end column. End column will be different that start when has merged cells.
        const endIndex = end - start + i;
        for (let j = i; j <= endIndex; j++) {
          if (rect.map.map[j] !== cell) {
            break;
          }

          // merged columns
          end = start + j - i; // Update the end column with the new position
        }
        if (start === end) {
          // We found the right column only when start and end columns are the same.
          return start;
        }
        next = iter.next();
        break;
      }

      // Sometimes I want to find a column at the end of the table (It doesn't exist, but we can add a new cell there).
      // This is represented by the end position of the last cell in the column.
      // In this case return, table width
      if (col === rect.map.width - 1) {
        const cellNode = rect.table.nodeAt(cell)!;
        if (cell + cellNode.nodeSize === cellInfo) {
          return rect.map.width;
        }
      }
    }
  }

  return null;
}
