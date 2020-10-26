import { TableRect } from '@atlaskit/editor-tables/table-map';
import { columnIsHeader, tableNodeTypes } from '@atlaskit/editor-tables/utils';
import { NodeType, Node as PMNode } from 'prosemirror-model';
import { CellAttributes } from '../../../schema/nodes/tableNodes';
import { getCellIndex, hasMergedColumns, isRootRow } from './table-map';

export interface Cell {
  from: number;
  to: number;
  row: number;
  col: number;
  attrs?: CellAttributes;
  hasMergedCells: boolean;
  type: NodeType;
}

/**
 * Helper to have a consistent way to iterate for all the cells in a column.
 * You can skip rows by passing the rows to skipped in the next arguments.
 * For example: `iter.next(1)` to skip the next row
 * @param rect
 * @param col
 */
export function* cellsAtColumn(rect: TableRect, col: number) {
  const { map, tableStart, table } = rect;

  let refColumn: number | null = col > 0 ? -1 : 0;
  if (columnIsHeader(map, table, col + refColumn)) {
    refColumn = col === 0 || col === map.width ? null : 0;
  }

  for (let row = 0; row < map.height; row++) {
    let index = getCellIndex(rect.map, row, col);
    let pos = map.map[index];

    // We only consider to has merged cell to the first cell in a rowspan.
    const hasMergedCells =
      hasMergedColumns(rect.map, row, col) && isRootRow(rect.map, row, col);

    // If this position falls inside a col-spanning cell
    let type =
      refColumn == null
        ? tableNodeTypes(table.type.schema).cell
        : table.nodeAt(map.map[index + refColumn])!.type;

    if (!hasMergedCells) {
      pos = map.positionAt(row, col, table);
    }
    let cell = table.nodeAt(pos) as PMNode;

    const cellInfo: Cell = {
      from: tableStart + pos,
      to: tableStart + pos,
      row,
      col: hasMergedCells ? map.colCount(pos) : col,
      type,
      hasMergedCells,
    };

    if (cell) {
      cellInfo.attrs = cell.attrs as CellAttributes;
      cellInfo.to = tableStart + pos + cell!.nodeSize;
    }

    // We let the consumer to pass the rows that we want to skip
    const skippedRows: number | undefined = yield cellInfo;

    if (skippedRows && skippedRows > 0) {
      row += skippedRows;
    }
  }
}
