import { EditorState } from 'prosemirror-state';

import { CellSelection } from '../cell-selection';
import { Rect, TableContext, TableMap } from '../table-map';

import { selectionCell } from './selection-cell';

export type SelectionRect = Rect & TableContext;

// Helper to get the selected rectangle in a table, if any. Adds table
// map, table node, and table start offset to the object for
// convenience.
export function selectedRect(state: EditorState): SelectionRect {
  const sel = state.selection;
  const $pos = selectionCell(sel);
  if (!$pos) {
    throw new Error(`selectedRect: invalid $pos for selection`);
  }
  const table = $pos.node(-1);
  const tableStart = $pos.start(-1);
  const map = TableMap.get(table);
  let rect: SelectionRect;
  if (sel instanceof CellSelection) {
    rect = map.rectBetween(
      sel.$anchorCell.pos - tableStart,
      sel.$headCell.pos - tableStart,
    ) as SelectionRect;
  } else {
    rect = map.findCell($pos.pos - tableStart) as SelectionRect;
  }
  rect.tableStart = tableStart;
  rect.map = map;
  rect.table = table;
  return rect;
}
