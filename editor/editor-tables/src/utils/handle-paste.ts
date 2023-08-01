import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { CellSelection } from '../cell-selection';
import { Rect, TableMap } from '../table-map';
import type { CellSelectionRect } from '../types';
import { selectionCell } from '../utils/selection-cell';
import { tableNodeTypes } from '../utils/table-node-types';
import { isInTable } from '../utils/tables';

import { clipCells, fitSlice, insertCells, pastedCells } from './copy-paste';

export function handlePaste(
  view: EditorView,
  event: Event | null,
  slice: Slice,
): boolean {
  if (!isInTable(view.state)) {
    return false;
  }

  let cells = pastedCells(slice);
  const sel = view.state.selection;
  if (sel instanceof CellSelection) {
    if (!cells) {
      cells = {
        width: 1,
        height: 1,
        rows: [
          Fragment.from(
            fitSlice(tableNodeTypes(view.state.schema).cell, slice),
          ),
        ],
      };
    }

    const table = sel.$anchorCell.node(-1);
    const start = sel.$anchorCell.start(-1);
    const tableMap = TableMap.get(table);
    const rect = tableMap.rectBetween(
      sel.$anchorCell.pos - start,
      sel.$headCell.pos - start,
    );
    cells = clipCells(cells, rect.right - rect.left, rect.bottom - rect.top);
    insertCells(
      view.state,
      view.dispatch,
      start,
      rect,
      clearColumnWidthOfCells(cells, rect, tableMap),
    );
    return true;
  }
  if (cells) {
    const $cell = selectionCell(sel);
    if (!$cell) {
      throw new Error(`handlePaste: no cell found`);
    }
    const start = $cell.start(-1);
    const rect = TableMap.get($cell.node(-1)).findCell($cell.pos - start);
    const tableMap = TableMap.get($cell.node(-1));

    insertCells(
      view.state,
      view.dispatch,
      start,
      rect,
      clearColumnWidthOfCells(cells, rect, tableMap),
    );
    return true;
  }
  return false;
}

// Clear the pasted cells column widths so that it maintains
// the column widths of the destination table only if the pasted
// cells overlap with existing cells in the destination table.
// If the table grows on paste, keep the column widhts of the
// original table.
const clearColumnWidthOfCells = (
  cells: CellSelectionRect,
  rect: Rect,
  table: TableMap,
) => {
  const overlappingCells = [];

  for (const row of cells.rows) {
    let colNum = rect.left;

    for (let index = 0; index < row.childCount; index++) {
      const cell = row.child(index);

      if (colNum + cell.attrs.colspan <= table.width) {
        overlappingCells.push(cell);
        colNum += cell.attrs.colspan;
      } else {
        break;
      }
    }
  }

  for (const cell of overlappingCells) {
    // TODO: ED-13910 unblock Prosemirror bump
    // @ts-ignore
    cell.attrs.colwidth = null;
  }

  return cells;
};
