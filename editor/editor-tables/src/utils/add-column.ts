import { NodeType, Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { TableContext, TableMap } from '../table-map';
import { CellAttributesWithColSpan } from '../types';

import { addColSpan, assertColspan } from './colspan';
import { tableNodeTypes } from './table-node-types';

export function columnIsHeader(
  map: TableMap,
  table: PMNode,
  col: number,
): boolean {
  const headerCell = tableNodeTypes(table.type.schema).header_cell;
  for (let row = 0; row < map.height; row++) {
    const cell = table.nodeAt(map.map[col + row * map.width]);
    if (cell && cell.type !== headerCell) {
      return false;
    }
  }

  return true;
}

// Add a column at the given position in a table.
export function addColumn(
  tr: Transaction,
  { map, tableStart, table }: TableContext,
  col: number,
): Transaction {
  let refColumn: number | null = col > 0 ? -1 : 0;
  if (columnIsHeader(map, table, col + refColumn)) {
    refColumn = col === 0 || col === map.width ? null : 0;
  }

  for (let row = 0; row < map.height; row++) {
    const index = row * map.width + col;

    // If this position falls inside a col-spanning cell
    if (col > 0 && col < map.width && map.map[index - 1] === map.map[index]) {
      const pos = map.map[index];
      const cell = table.nodeAt(pos);
      if (!cell) {
        throw new Error(`addColumn: invalid cell for pos ${pos}`);
      }
      const attributes = cell.attrs;
      assertColspan(attributes);

      tr.setNodeMarkup(
        tr.mapping.map(tableStart + pos),
        undefined,
        addColSpan(
          attributes as CellAttributesWithColSpan,
          col - map.colCount(pos),
        ),
      );
      // Skip ahead if rowspan > 1
      row += attributes.rowspan - 1;
    } else {
      let type: NodeType;

      if (refColumn === null) {
        type = tableNodeTypes(table.type.schema).cell;
      } else {
        const mappedPos = map.map[index + refColumn];
        const cell = table.nodeAt(mappedPos);
        if (!cell) {
          throw new Error(`addColumn: invalid node at mapped pos ${mappedPos}`);
        }
        type = cell.type;
      }
      const pos = map.positionAt(row, col, table);
      tr.insert(tr.mapping.map(tableStart + pos), type.createAndFill()!);
    }
  }

  return tr;
}
