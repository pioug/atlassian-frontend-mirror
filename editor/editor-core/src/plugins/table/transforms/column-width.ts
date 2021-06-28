import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import { CellAttributes } from '@atlaskit/adf-schema';

import { ResizeState } from '../pm-plugins/table-resizing/utils';

import { setMeta } from './metadata';

export const updateColumnWidths = (
  resizeState: ResizeState,
  table: PMNode,
  start: number,
) => (tr: Transaction): Transaction => {
  const map = TableMap.get(table);
  const updatedCellsAttrs: { [key: number]: CellAttributes } = {};

  // calculating new attributes for each cell
  for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
    for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
      const { width } = resizeState.cols[columnIndex];
      const mapIndex = rowIndex * map.width + columnIndex;
      const cellPos = map.map[mapIndex];
      const attrs = updatedCellsAttrs[cellPos] || {
        ...table.nodeAt(cellPos)!.attrs,
      };
      const colspan = attrs.colspan || 1;

      if (attrs.colwidth && attrs.colwidth.length > colspan) {
        tr = setMeta({
          type: 'UPDATE_COLUMN_WIDTHS',
          problem: 'COLWIDTHS_BEFORE_UPDATE',
          data: { colwidths: attrs.colwidth, colspan },
        })(tr);
        attrs.colwidth = attrs.colwidth.slice(0, colspan);
      }

      // Rowspanning cell that has already been handled
      if (rowIndex && map.map[mapIndex] === map.map[mapIndex - map.width]) {
        continue;
      }
      const colspanIndex =
        colspan === 1 ? 0 : columnIndex - map.colCount(cellPos);
      if (attrs.colwidth && attrs.colwidth[colspanIndex] === width) {
        continue;
      }

      let colwidths = attrs.colwidth
        ? attrs.colwidth.slice()
        : Array.from({ length: colspan }, (_) => 0);

      colwidths[colspanIndex] = width;
      if (colwidths.length > colspan) {
        tr = setMeta({
          type: 'UPDATE_COLUMN_WIDTHS',
          problem: 'COLWIDTHS_AFTER_UPDATE',
          data: { colwidths, colspan },
        })(tr);
        colwidths = colwidths.slice(0, colspan);
      }
      updatedCellsAttrs[cellPos] = {
        ...attrs,
        colwidth: colwidths.includes(0) ? undefined : colwidths,
      };
    }
  }

  // updating all cells with new attributes
  const rows: PMNode[] = [];
  const seen: { [key: number]: boolean } = {};
  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const row = table.child(rowIndex);
    const cells: PMNode[] = [];

    for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
      const mapIndex = rowIndex * map.width + columnIndex;
      const pos = map.map[mapIndex];
      const cell = table.nodeAt(pos);
      if (!seen[pos] && cell) {
        cells.push(
          cell.type.createChecked(
            updatedCellsAttrs[pos] || cell.attrs,
            cell.content,
            cell.marks,
          ),
        );
        seen[pos] = true;
      }
    }
    rows.push(row.type.createChecked(row.attrs, cells, row.marks));
  }

  const tablePos = start - 1;
  const { selection } = tr;

  /* Create a mapping before the table node is replaced to allow the current
   * selection to be mapped back to it's original position inside the table.
   *
   * If the mapping from the new 'replaceWith' transaction is used, prosemirror
   * will map the selection to after the table as it thinks the original table
   * node has been deleted.
   */
  const originalMap = Object.assign(
    Object.create(Object.getPrototypeOf(tr.mapping)),
    tr.mapping,
  );

  tr.replaceWith(
    tablePos,
    tablePos + table.nodeSize,
    table.type.createChecked(table.attrs, rows, table.marks),
  );

  // restore selection after replacing the table
  return tr.setSelection(selection.map(tr.doc, originalMap));
};
