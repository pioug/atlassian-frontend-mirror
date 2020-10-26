import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { Node } from 'prosemirror-model';

export const cellSelectionNodesBetween = (
  selection: CellSelection,
  doc: Node,
  f: (
    node: Node,
    pos: number,
    parent: Node,
    index: number,
  ) => boolean | null | undefined | void,
  startPos?: number,
) => {
  selection.forEachCell((cell, cellPos) => {
    doc.nodesBetween(cellPos, cellPos + cell.nodeSize, f, startPos);
  });
};
