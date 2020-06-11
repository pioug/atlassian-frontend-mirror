import { Node as PMNode, Schema } from 'prosemirror-model';
import {
  AddCellArgs,
  Builder,
  CellType,
  Table,
  TableCell,
  TableRow,
} from '../../interfaces';

/**
 * Return the cell type based on the delimeter
 */
function getType(style: string): CellType {
  return /\|\|/.test(style) ? 'tableHeader' : 'tableCell';
}

export class TableBuilder implements Builder {
  private schema: Schema;
  private root: Table;
  private lastRow?: TableRow;

  constructor(schema: Schema) {
    this.schema = schema;
    this.root = {
      rows: [],
    };
  }

  /**
   * Return the type of the base element
   * @returns {string}
   */
  get type(): string {
    return 'table';
  }

  /**
   * Add new cells to the table
   * @param {AddCellArgs[]} cells
   */
  add(cells: AddCellArgs[]) {
    if (!cells.length) {
      return;
    }
    // Iterate the cells and create TH/TD based on the delimeter
    let index = 0;

    for (const cell of cells) {
      const { content, style } = cell;
      const cellType = getType(style);

      // For the first item, determine if it's a new row or not
      if (index === 0) {
        this.addRow();
      }

      const newCell = { type: cellType, content };
      this.lastRow!.cells.push(newCell);

      index += 1;
    }
  }

  /**
   * Build a prosemirror table from the data
   * @returns {PMNode}
   */
  buildPMNode(): PMNode {
    return this.buildTableNode();
  }

  private emptyTableCell = (): PMNode => {
    const { tableCell, paragraph } = this.schema.nodes;
    return tableCell.createChecked({}, paragraph.createChecked());
  };

  private emptyTableRow = (): PMNode => {
    const { tableRow } = this.schema.nodes;
    return tableRow.createChecked({}, this.emptyTableCell());
  };

  /**
   * Build prosemirror table node
   * @returns {PMNode}
   */
  private buildTableNode = (): PMNode => {
    const { root } = this;
    const { table } = this.schema.nodes;
    const content = root.rows.map(this.buildTableRowNode);
    if (content.length === 0) {
      content.push(this.emptyTableRow());
    }
    return table.createChecked({}, content);
  };

  /**
   * Build prosemirror tr node
   * @returns {PMNode}
   */
  private buildTableRowNode = (row: TableRow): PMNode => {
    const { tableRow } = this.schema.nodes;
    return tableRow.createChecked({}, row.cells.map(this.buildTableCellNode));
  };

  /**
   * Build prosemirror td/th node
   * @param {TableCell} cell
   * @returns {PMNode}
   */
  private buildTableCellNode = (cell: TableCell): PMNode => {
    const { type, content } = cell;
    if (content.length === 0) {
      content.push(this.schema.nodes.paragraph.createChecked());
    }
    const cellNode = this.schema.nodes[type];
    return cellNode.createChecked({}, content);
  };

  /**
   * Add a new row to the table
   */
  private addRow() {
    const { rows } = this.root;
    const row: TableRow = {
      cells: [],
    };

    rows.push(row);

    this.lastRow = row;
  }
}
