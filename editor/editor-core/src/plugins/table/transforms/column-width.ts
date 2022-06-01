import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { tableNewColumnMinWidth } from '@atlaskit/editor-common/styles';

import { CellAttributes } from '@atlaskit/adf-schema';

import {
  hasTableBeenResized,
  ResizeState,
} from '../pm-plugins/table-resizing/utils';

import { setMeta } from './metadata';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import {
  getResizeState,
  normaliseTableLayout,
} from '../pm-plugins/table-resizing/utils/resize-state';
import { getTableMaxWidth } from '../pm-plugins/table-resizing/utils/misc';
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { scaleTableTo } from '../pm-plugins/table-resizing/utils/scale-table';

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
  const selectionBookmark = tr.selection.getBookmark();

  tr.replaceWith(
    tablePos,
    tablePos + table.nodeSize,
    table.type.createChecked(table.attrs, rows, table.marks),
  );
  /**
   * We want to restore to the original selection but w/o applying the mapping. Function
   * tr.replaceWith puts the selection after the inserted content. We need to manually
   * set the selection back to original state. Mapping in this case doesn't quite work
   * e.g. if we change the content before a selection. This is because mapping
   * means moving it if the content in front of it changed. Instead we can get
   * bookmark of selection.
   *
   * @see https://github.com/ProseMirror/prosemirror/issues/645
   */
  return tr.setSelection(selectionBookmark.resolve(tr.doc));
};

/**
 * This function is called when user inserts/deletes a column in a table to;
 * - rescale all columns (if the table did not overflow before the insertion)
 * - and update column widths.
 *
 * This is done manually to avoid a multi-dispatch in TableComponent. See [ED-8288].
 * @param table
 * @param view
 * @returns Updated transaction with rescaled columns for a given table
 */
export const rescaleColumns = (
  table: ContentNodeWithPos,
  view: EditorView | undefined,
) => (tr: Transaction): Transaction => {
  // If the table has been not been resized we skip updating the size
  // of columns here.
  if (!view || !hasTableBeenResized(table.node)) {
    return tr;
  }

  const { state } = view;
  const domAtPos = view.domAtPos.bind(view);

  const maybeTable = domAtPos(table.start).node as HTMLElement;
  const tableRef = maybeTable.closest('table');

  if (!tableRef) {
    return tr;
  }

  const layout = normaliseTableLayout(tableRef?.dataset.layout);
  // The is the width the table can reach before overflowing
  const maxSize = getTableMaxWidth({
    table: table.node,
    tableStart: table.start,
    state,
    layout,
  });
  let resizeState = getResizeState({
    minWidth: tableCellMinWidth,
    table: table.node,
    start: table.start,
    tableRef,
    domAtPos,
    maxSize,
  });
  const previousTableWidth = resizeState.tableWidth - tableNewColumnMinWidth;
  const tableDidntPreviouslyOverflow = previousTableWidth <= maxSize;

  // If the new table width will result in the table going into an overflow state
  // we resize the cells to avoid the overflow occuring
  if (tableDidntPreviouslyOverflow && resizeState.overflow) {
    resizeState = scaleTableTo(resizeState, maxSize);
  }

  return updateColumnWidths(resizeState, table.node, table.start)(tr);
};
