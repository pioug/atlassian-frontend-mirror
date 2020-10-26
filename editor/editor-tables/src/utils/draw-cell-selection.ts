import { EditorState } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { CellSelection } from '../cell-selection';

export function drawCellSelection(state: EditorState): DecorationSet | null {
  if (!(state.selection instanceof CellSelection)) {
    return null;
  }
  const cells: Decoration[] = [];
  state.selection.forEachCell((node, pos) => {
    cells.push(
      Decoration.node(pos, pos + node.nodeSize, { class: 'selectedCell' }),
    );
  });
  return DecorationSet.create(state.doc, cells);
}
