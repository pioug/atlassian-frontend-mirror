import { ResolvedPos } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

import { Command, Direction } from '../types';

import { selectionCell } from './selection-cell';
import { isInTable } from './tables';

function moveCellForward($pos: ResolvedPos): ResolvedPos {
  const nextNodeSize = $pos.nodeAfter ? $pos.nodeAfter.nodeSize : 0;
  return $pos.node(0).resolve($pos.pos + nextNodeSize);
}

// Returns a command for selecting the next (direction=1) or previous
// (direction=-1) cell in a table.
export function goToNextCell(direction: Direction): Command {
  return function (state, dispatch) {
    if (!isInTable(state)) {
      return false;
    }
    const cellSelection = selectionCell(state.selection);
    if (!cellSelection) {
      return false;
    }
    const cell = findNextCell(cellSelection, direction);
    if (cell === undefined) {
      return false;
    }
    if (dispatch) {
      const $cell = state.doc.resolve(cell);
      dispatch(
        state.tr
          .setSelection(TextSelection.between($cell, moveCellForward($cell)))
          .scrollIntoView(),
      );
    }
    return true;
  };
}

function findNextCell(
  $cell: ResolvedPos,
  direction: Direction,
): number | undefined {
  if (direction === -1) {
    const before = $cell.nodeBefore;
    if (before) {
      return $cell.pos - before.nodeSize;
    }
    for (
      let row = $cell.index(-1) - 1, rowEnd = $cell.before();
      row >= 0;
      row--
    ) {
      const rowNode = $cell.node(-1).child(row);
      if (rowNode.childCount && rowNode.lastChild) {
        return rowEnd - 1 - rowNode.lastChild.nodeSize;
      }
      rowEnd -= rowNode.nodeSize;
    }
  } else {
    if ($cell.index() < $cell.parent.childCount - 1 && $cell.nodeAfter) {
      return $cell.pos + $cell.nodeAfter.nodeSize;
    }

    const table = $cell.node(-1);
    for (
      let row = $cell.indexAfter(-1), rowStart = $cell.after();
      row < table.childCount;
      row++
    ) {
      const rowNode = table.child(row);
      if (rowNode.childCount) {
        return rowStart + 1;
      }
      rowStart += rowNode.nodeSize;
    }
  }
}
