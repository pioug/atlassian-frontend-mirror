import { NodeType, Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { TableContext, TableMap } from '../table-map';

import { tableNodeTypes } from './table-node-types';

function rowIsHeader(map: TableMap, table: PMNode, row: number): boolean {
  const headerCell = tableNodeTypes(table.type.schema).header_cell;
  for (let col = 0; col < map.width; col++) {
    const cell = table.nodeAt(map.map[col + row * map.width]);
    if (cell && cell.type !== headerCell) {
      return false;
    }
  }

  return true;
}

export function addRow(
  tr: Transaction,
  { map, tableStart, table }: TableContext,
  row: number,
): Transaction {
  let rowPos = tableStart;
  for (let i = 0; i < row; i++) {
    rowPos += table.child(i).nodeSize;
  }
  const cells = [];
  let refRow: number | null = row > 0 ? -1 : 0;
  if (rowIsHeader(map, table, row + refRow)) {
    refRow = row === 0 || row === map.height ? null : 0;
  }
  for (let col = 0, index = map.width * row; col < map.width; col++, index++) {
    // Covered by a rowspan cell
    if (
      row > 0 &&
      row < map.height &&
      map.map[index] === map.map[index - map.width]
    ) {
      const pos = map.map[index];
      const node = table.nodeAt(pos);
      if (!node) {
        throw new Error(`addRow: node not found at pos ${pos}`);
      }

      const { attrs } = node;
      tr.setNodeMarkup(tableStart + pos, undefined, {
        ...attrs,
        rowspan: attrs.rowspan + 1,
      });
      col += attrs.colspan - 1;
    } else {
      let type: NodeType;

      if (refRow == null) {
        type = tableNodeTypes(table.type.schema).cell;
      } else {
        const mappedPos = map.map[index + refRow * map.width];
        const cell = table.nodeAt(mappedPos);
        if (!cell) {
          throw new Error(`addRow: invalid node at mapped pos ${mappedPos}`);
        }
        type = cell.type;
      }
      cells.push(type.createAndFill()!);
    }
  }
  const rowType = tableNodeTypes(table.type.schema).row;
  const rowCells = rowType.create(null, cells);
  tr.insert(rowPos, rowCells);

  return tr;
}
