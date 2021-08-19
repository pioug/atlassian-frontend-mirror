import { NodeType, Node as PMNode, Schema } from 'prosemirror-model';

import { tableNodeTypes } from './table-node-types';
import { uuid } from './uuid';

const createCell = (
  cellType: NodeType,
  cellContent?: PMNode,
): PMNode | undefined | null => {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }

  return cellType.createAndFill();
};

// Returns a table node of a given size.
// `withHeaderRow` defines whether the first row of the table will be a header row.
// `cellContent` defines the content of each cell.

type CreateTableProps = {
  schema: Schema;
  rowsCount?: number;
  colsCount?: number;
  withHeaderRow?: boolean;
  cellContent?: PMNode;
};

export const createTable = ({
  schema,
  rowsCount = 3,
  colsCount = 3,
  withHeaderRow = true,
  cellContent,
}: CreateTableProps): PMNode => {
  const {
    cell: tableCell,
    header_cell: tableHeader,
    row: tableRow,
    table,
  } = tableNodeTypes(schema);

  const cells: PMNode[] = [];
  const headerCells: PMNode[] = [];

  for (let i = 0; i < colsCount; i++) {
    const cell = createCell(tableCell, cellContent);
    if (cell) {
      cells.push(cell);
    }

    if (withHeaderRow) {
      const headerCell = createCell(tableHeader, cellContent);
      if (headerCell) {
        headerCells.push(headerCell);
      }
    }
  }

  const rows = [];
  for (let i = 0; i < rowsCount; i++) {
    rows.push(
      tableRow.createChecked(
        null,
        withHeaderRow && i === 0 ? headerCells : cells,
      ),
    );
  }

  return table.createChecked({ localId: uuid.generate() }, rows);
};
