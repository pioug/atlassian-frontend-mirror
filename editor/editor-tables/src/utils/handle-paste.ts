import { Fragment, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
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
    const rect = TableMap.get(table).rectBetween(
      sel.$anchorCell.pos - start,
      sel.$headCell.pos - start,
    );
    cells = clipCells(cells, rect.right - rect.left, rect.bottom - rect.top);
    insertCells(view.state, view.dispatch, start, rect, cells);
    return true;
  }
  if (cells) {
    const $cell = selectionCell(sel);
    if (!$cell) {
      throw new Error(`handlePaste: no cell found`);
    }
    const start = $cell.start(-1);
    insertCells(
      view.state,
      view.dispatch,
      start,
      TableMap.get($cell.node(-1)).findCell($cell.pos - start),
      cells,
    );
    return true;
  }
  return false;
}
