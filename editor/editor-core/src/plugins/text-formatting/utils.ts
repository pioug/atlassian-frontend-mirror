import { EditorState } from 'prosemirror-state';
import { Mark as PMMark, MarkType } from 'prosemirror-model';
import { CellSelection } from 'prosemirror-tables';
import {
  FORMATTING_MARK_TYPES,
  FORMATTING_NODE_TYPES,
} from './commands/clear-formatting';

export const nodeLen = (node: Node): number => {
  return node.nodeType === 3 && node.nodeValue
    ? node.nodeValue.length
    : node.childNodes.length;
};

export const isIgnorable = (dom: any): boolean =>
  dom.pmViewDesc && dom.pmViewDesc.size === 0;

export const isBlockNode = (dom: any): boolean => {
  const desc = dom.pmViewDesc;
  return desc && desc.node && desc.node.isBlock;
};

export const domIndex = function(node: Node | null): number | undefined {
  if (node) {
    for (let index = 0; ; index++) {
      node = node.previousSibling;
      if (!node) {
        return index;
      }
    }
  }
  return;
};

export const hasCode = (state: EditorState, pos: number): boolean => {
  const { code } = state.schema.marks;
  const node = pos >= 0 && state.doc.nodeAt(pos);
  if (node) {
    return !!node.marks.filter(mark => mark.type === code).length;
  }

  return false;
};

/**
 * Determine if a mark (with specific attribute values) exists anywhere in the selection.
 */
export const markActive = (state: EditorState, mark: PMMark): boolean => {
  const { from, to, empty } = state.selection;
  // When the selection is empty, only the active marks apply.
  if (empty) {
    return !!mark.isInSet(
      state.tr.storedMarks || state.selection.$from.marks(),
    );
  }
  // For a non-collapsed selection, the marks on the nodes matter.
  let found = false;
  state.doc.nodesBetween(from, to, node => {
    found = found || mark.isInSet(node.marks);
  });
  return found;
};

/**
 * Determine if a mark of a specific type exists anywhere in the selection.
 */
export const anyMarkActive = (
  state: EditorState,
  markType: MarkType,
): boolean => {
  const { $from, from, to, empty } = state.selection;
  if (empty) {
    return !!markType.isInSet(state.storedMarks || $from.marks());
  }

  let rangeHasMark = false;
  if (state.selection instanceof CellSelection) {
    state.selection.forEachCell((cell, cellPos) => {
      const from = cellPos;
      const to = cellPos + cell.nodeSize;
      if (!rangeHasMark) {
        rangeHasMark = state.doc.rangeHasMark(from, to, markType);
      }
    });
  } else {
    rangeHasMark = state.doc.rangeHasMark(from, to, markType);
  }

  return rangeHasMark;
};

const blockStylingIsPresent = (state: EditorState): boolean => {
  let { from, to } = state.selection;
  let isBlockStyling = false;
  state.doc.nodesBetween(from, to, node => {
    if (FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
      isBlockStyling = true;
      return false;
    }
    return true;
  });
  return isBlockStyling;
};

const marksArePresent = (state: EditorState) => {
  const activeMarkTypes = FORMATTING_MARK_TYPES.filter(mark => {
    if (!!state.schema.marks[mark]) {
      const { $from, empty } = state.selection;
      const { marks } = state.schema;
      if (empty) {
        return !!marks[mark].isInSet(state.storedMarks || $from.marks());
      }
      return anyMarkActive(state, marks[mark]);
    }
    return false;
  });
  return activeMarkTypes.length > 0;
};

export const checkFormattingIsPresent = (state: EditorState) => {
  return marksArePresent(state) || blockStylingIsPresent(state);
};
