import type {
  Fragment,
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import {
  EditorState,
  TextSelection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { GapCursorSelection } from '../selection';
import type { Command } from '../types';

import { isEmptyParagraph } from './editor-core-utils';

export type WalkNode = {
  $pos: ResolvedPos;
  foundNode: boolean;
};

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

/**
 * Walk forwards from a position until we encounter the (inside) start of
 * the next node, or reach the end of the document.
 *
 * @param $startPos Position to start walking from.
 */
export const walkNextNode = ($startPos: ResolvedPos): WalkNode => {
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
export const walkPrevNode = ($startPos: ResolvedPos): WalkNode => {
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
 * If the selection is empty, is inside a paragraph node and `canNextNodeMoveUp` is true then delete current paragraph
 * and move the node below it up. The selection will be retained, to be placed in the moved node.
 *
 * @param canNextNodeMoveUp check if node directly after the selection is able to be brought up to selection
 * @returns PM Command
 */
export const deleteEmptyParagraphAndMoveBlockUp = (
  canNextNodeMoveUp: (nextNode: PMNode) => boolean,
): Command => {
  return (state, dispatch, view) => {
    const {
      selection: {
        $from: { pos, parent },
        $head,
        empty,
      },
      tr,
      doc,
    } = state;
    const { $pos } = walkNextNode($head);
    const nextPMNode = doc.nodeAt($pos.pos - 1);

    if (
      empty &&
      nextPMNode &&
      canNextNodeMoveUp(nextPMNode) &&
      isEmptyParagraph(parent) &&
      view?.endOfTextblock('right')
    ) {
      tr.deleteRange(pos - 1, pos + 1);

      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };
};

export const insertContentDeleteRange = (
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

export const isEmptySelectionAtStart = (state: EditorState): boolean => {
  const { empty, $from } = state.selection;
  return (
    empty &&
    ($from.parentOffset === 0 || state.selection instanceof GapCursorSelection)
  );
};

export const isEmptySelectionAtEnd = (state: EditorState): boolean => {
  const { empty, $from } = state.selection;
  return (
    empty &&
    ($from.end() === $from.pos || state.selection instanceof GapCursorSelection)
  );
};

export { filter as filterCommand };
