import {
  EditorState,
  TextSelection,
  NodeSelection,
  Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import {
  ResolvedPos,
  MarkType,
  Mark,
  Node as PmNode,
  Fragment,
} from 'prosemirror-model';
import { transformSmartCharsMentionsAndEmojis } from '../plugins/text-formatting/commands/transform-to-code';
import { GapCursorSelection } from '../plugins/selection/gap-cursor-selection';
import { Command, HigherOrderCommand } from '../types/command';

type Predicate = (state: EditorState, view?: EditorView) => boolean;

const filter = (predicates: Predicate[] | Predicate, cmd: Command): Command => {
  return function (state, dispatch, view): boolean {
    if (!Array.isArray(predicates)) {
      predicates = [predicates];
    }

    if (predicates.some((pred) => !pred(state, view))) {
      return false;
    }

    return cmd(state, dispatch, view) || false;
  };
};

const isEmptySelectionAtStart = (state: EditorState): boolean => {
  const { empty, $from } = state.selection;
  return (
    empty &&
    ($from.parentOffset === 0 || state.selection instanceof GapCursorSelection)
  );
};

const isEmptySelectionAtEnd = (state: EditorState): boolean => {
  const { empty, $from } = state.selection;
  return (
    empty &&
    ($from.end() === $from.pos || state.selection instanceof GapCursorSelection)
  );
};

const isFirstChildOfParent = (state: EditorState): boolean => {
  const { $from } = state.selection;
  return $from.depth > 1
    ? (state.selection instanceof GapCursorSelection &&
        $from.parentOffset === 0) ||
        $from.index($from.depth - 1) === 0
    : true;
};

/**
 * Creates a filter that checks if the node at a given number of parents above the current
 * selection is of the correct node type.
 * @param nodeType The node type to compare the nth parent against
 * @param depthAway How many levels above the current node to check against. 0 refers to
 * the current selection's parent, which will be the containing node when the selection
 * is usually inside the text content.
 */
const isNthParentOfType = (
  nodeType: string,
  depthAway: number,
): ((state: EditorState, view?: EditorView) => boolean) => {
  return (state: EditorState): boolean => {
    const { $from } = state.selection;
    const parent = $from.node($from.depth - depthAway);

    return !!parent && parent.type === state.schema.nodes[nodeType];
  };
};

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L90
// Keep going left up the tree, without going across isolating boundaries, until we
// can go along the tree at that same level
//
// You can think of this as, if you could construct each document like we do in the tests,
// return the position of the first ) backwards from the current selection.
function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
  // parent is non-isolating, so we can look across this boundary
  if (!$pos.parent.type.spec.isolating) {
    // search up the tree from the pos's *parent*
    for (let i = $pos.depth - 1; i >= 0; i--) {
      // starting from the inner most node's parent, find out
      // if we're not its first child
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1));
      }

      if ($pos.node(i).type.spec.isolating) {
        break;
      }
    }
  }

  return null;
}

const applyMarkOnRange = (
  from: number,
  to: number,
  removeMark: boolean,
  mark: Mark,
  tr: Transaction,
) => {
  const { schema } = tr.doc.type;
  const { code } = schema.marks;
  if (mark.type === code) {
    transformSmartCharsMentionsAndEmojis(from, to, tr);
  }

  tr.doc.nodesBetween(tr.mapping.map(from), tr.mapping.map(to), (node, pos) => {
    if (!node.isText) {
      return true;
    }

    // This is an issue when the user selects some text.
    // We need to check if the current node position is less than the range selection from.
    // If it’s true, that means we should apply the mark using the range selection,
    // not the current node position.
    const nodeBetweenFrom = Math.max(pos, tr.mapping.map(from));
    const nodeBetweenTo = Math.min(pos + node.nodeSize, tr.mapping.map(to));

    if (removeMark) {
      tr.removeMark(nodeBetweenFrom, nodeBetweenTo, mark);
    } else {
      tr.addMark(nodeBetweenFrom, nodeBetweenTo, mark);
    }

    return true;
  });

  return tr;
};

const toggleMarkInRange = (mark: Mark): Command => (state, dispatch) => {
  const tr = state.tr;
  if (state.selection instanceof CellSelection) {
    let markInRange = false;
    const cells: { node: PmNode; pos: number }[] = [];
    state.selection.forEachCell((cell, cellPos) => {
      cells.push({ node: cell, pos: cellPos });
      const from = cellPos;
      const to = cellPos + cell.nodeSize;
      if (!markInRange) {
        markInRange = state.doc.rangeHasMark(
          from,
          to,
          (mark as unknown) as MarkType,
        );
      }
    });

    for (let i = cells.length - 1; i >= 0; i--) {
      const cell = cells[i];
      const from = cell.pos;
      const to = from + cell.node.nodeSize;

      applyMarkOnRange(from, to, markInRange, mark, tr);
    }
  } else {
    const { $from, $to } = state.selection;
    // The type for `rangeHasMark` only accepts a `MarkType` as a third param,
    // Yet the internals use a method that exists on both MarkType and Mark (one checks attributes the other doesnt)
    // For example, with our subsup mark: We use the same mark with different attributes to convert
    // different formatting but when using `MarkType.isInSet(marks)` it returns true for both.
    // Calling `Mark.isInSet(marks)` compares attributes as well.
    const markInRange = state.doc.rangeHasMark(
      $from.pos,
      $to.pos,
      (mark as unknown) as MarkType,
    );

    applyMarkOnRange($from.pos, $to.pos, markInRange, mark, tr);
  }

  if (tr.docChanged) {
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  }

  return false;
};

/**
 * A wrapper over the default toggleMark, except when we have a selection
 * we only toggle marks on text nodes rather than inline nodes.
 * @param markType
 * @param attrs
 */
const toggleMark = (
  markType: MarkType,
  attrs?: { [key: string]: any },
): Command => (state, dispatch) => {
  const mark = markType.create(attrs);

  // For cursor selections we can use the default behaviour.
  if (state.selection instanceof TextSelection && state.selection.$cursor) {
    const tr = state.tr;
    if (mark.isInSet(state.storedMarks || state.selection.$cursor.marks())) {
      tr.removeStoredMark(mark);
    } else {
      tr.addStoredMark(mark);
    }

    if (dispatch) {
      dispatch(tr);
      return true;
    }

    return false;
  }

  return toggleMarkInRange(mark)(state, dispatch);
};

const withScrollIntoView: HigherOrderCommand = (command: Command): Command => (
  state,
  dispatch,
  view,
) =>
  command(
    state,
    (tr) => {
      tr.scrollIntoView();
      if (dispatch) {
        dispatch(tr);
      }
    },
    view,
  );

export type WalkNode = {
  $pos: ResolvedPos;
  foundNode: boolean;
};

/**
 * Walk forwards from a position until we encounter the (inside) start of
 * the next node, or reach the end of the document.
 *
 * @param $startPos Position to start walking from.
 */
const walkNextNode = ($startPos: ResolvedPos): WalkNode => {
  let $pos = $startPos;

  // invariant 1: don't walk past the end of the document
  // invariant 2: we are at the beginning or
  //              we haven't walked to the start of *any* node
  //              parentOffset includes textOffset.
  while (
    $pos.pos < $pos.doc.nodeSize - 2 &&
    ($pos.pos === $startPos.pos || $pos.parentOffset > 0)
  ) {
    $pos = $pos.doc.resolve($pos.pos + 1);
  }

  return {
    $pos: $pos,
    foundNode: $pos.pos < $pos.doc.nodeSize - 2,
  };
};

/**
 * Walk backwards from a position until we encounter the (inside) end of
 * the previous node, or reach the start of the document.
 *
 * @param $startPos Position to start walking from.
 */
const walkPrevNode = ($startPos: ResolvedPos): WalkNode => {
  let $pos = $startPos;

  while (
    $pos.pos > 0 &&
    ($pos.pos === $startPos.pos || $pos.parentOffset < $pos.parent.nodeSize - 2)
  ) {
    $pos = $pos.doc.resolve($pos.pos - 1);
  }

  return {
    $pos: $pos,
    foundNode: $pos.pos > 0,
  };
};

/**
 * Insert content, delete a range and create a new selection
 * This function automatically handles the mapping of positions for insertion and deletion.
 * The new selection is handled as a function since it may not always be necessary to resolve a position to the transactions mapping
 *
 * @param getSelectionResolvedPos get the resolved position to create a new selection
 * @param insertions content to insert at the specified position
 * @param deletions the ranges to delete
 */

const insertContentDeleteRange = (
  tr: Transaction,
  getSelectionResolvedPos: (tr: Transaction) => ResolvedPos,
  insertions: [Fragment, number][],
  deletions: [number, number][],
) => {
  insertions.forEach((contentInsert) => {
    let [content, pos] = contentInsert;

    tr.insert(tr.mapping.map(pos), content);
  });

  deletions.forEach((deleteRange) => {
    let [firstPos, lastPos] = deleteRange;

    tr.delete(tr.mapping.map(firstPos), tr.mapping.map(lastPos));
  });

  tr.setSelection(new TextSelection(getSelectionResolvedPos(tr)));
};

const selectNode = (pos: number): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))));
  }
  return true;
};

export {
  filter,
  isEmptySelectionAtStart,
  isEmptySelectionAtEnd,
  isFirstChildOfParent,
  isNthParentOfType,
  findCutBefore,
  toggleMark,
  applyMarkOnRange,
  withScrollIntoView,
  walkNextNode,
  walkPrevNode,
  insertContentDeleteRange,
  selectNode,
};
export type {
  // https://github.com/typescript-eslint/typescript-eslint/issues/131
  // eslint-disable-next-line no-undef
  Predicate,
};
