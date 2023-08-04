import {
  Fragment,
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import {
  EditorState,
  NodeSelection,
  TextSelection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EditorAnalyticsAPI,
  EVENT_TYPE,
} from '../analytics';
import { withAnalytics } from '../editor-analytics';
import { GapCursorSelection } from '../selection';
import type { Command, Predicate } from '../types';

import { isEmptyParagraph } from './editor-core-utils';
import { isMediaNode } from './nodes';

export type WalkNode = {
  $pos: ResolvedPos;
  foundNode: boolean;
};

export const filter = (
  predicates: Predicate[] | Predicate,
  cmd: Command,
): Command => {
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

export function insertNewLine(): Command {
  return function (state, dispatch) {
    const { $from } = state.selection;
    const parent = $from.parent;
    const { hardBreak } = state.schema.nodes;

    if (hardBreak) {
      const hardBreakNode = hardBreak.createChecked();

      if (parent && parent.type.validContent(Fragment.from(hardBreakNode))) {
        if (dispatch) {
          dispatch(state.tr.replaceSelectionWith(hardBreakNode, false));
        }
        return true;
      }
    }

    if (state.selection instanceof TextSelection) {
      if (dispatch) {
        dispatch(state.tr.insertText('\n'));
      }
      return true;
    }

    return false;
  };
}

export const insertNewLineWithAnalytics = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) =>
  withAnalytics(editorAnalyticsAPI, {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.LINE_BREAK,
    eventType: EVENT_TYPE.TRACK,
  })(insertNewLine());

export const createNewParagraphAbove: Command = (state, dispatch) => {
  const append = false;
  if (!canMoveUp(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
};

export const createNewParagraphBelow: Command = (state, dispatch) => {
  const append = true;
  if (!canMoveDown(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
};

function canCreateParagraphNear(state: EditorState): boolean {
  const {
    selection: { $from },
  } = state;
  const node = $from.node($from.depth);
  const insideCodeBlock = !!node && node.type === state.schema.nodes.codeBlock;
  const isNodeSelection = state.selection instanceof NodeSelection;
  return $from.depth > 1 || isNodeSelection || insideCodeBlock;
}

export function createParagraphNear(append: boolean = true): Command {
  return function (state, dispatch) {
    const paragraph = state.schema.nodes.paragraph;

    if (!paragraph) {
      return false;
    }

    let insertPos;

    if (state.selection instanceof TextSelection) {
      if (topLevelNodeIsEmptyTextBlock(state)) {
        return false;
      }
      insertPos = getInsertPosFromTextBlock(state, append);
    } else {
      insertPos = getInsertPosFromNonTextBlock(state, append);
    }

    const tr = state.tr.insert(insertPos, paragraph.createAndFill() as PMNode);
    tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function getInsertPosFromTextBlock(
  state: EditorState,
  append: boolean,
): number {
  const { $from, $to } = state.selection;
  let pos;
  if (!append) {
    pos = $from.start(0);
  } else {
    pos = $to.end(0);
  }
  return pos;
}

function getInsertPosFromNonTextBlock(
  state: EditorState,
  append: boolean,
): number {
  const { $from, $to } = state.selection;
  const nodeAtSelection =
    state.selection instanceof NodeSelection &&
    state.doc.nodeAt(state.selection.$anchor.pos);
  const isMediaSelection =
    nodeAtSelection && nodeAtSelection.type.name === 'mediaGroup';

  let pos;
  if (!append) {
    // The start position is different with text block because it starts from 0
    pos = $from.start($from.depth);
    // The depth is different with text block because it starts from 0
    pos = $from.depth > 0 && !isMediaSelection ? pos - 1 : pos;
  } else {
    pos = $to.end($to.depth);
    pos = $to.depth > 0 && !isMediaSelection ? pos + 1 : pos;
  }
  return pos;
}

function topLevelNodeIsEmptyTextBlock(state: EditorState): boolean {
  const topLevelNode = state.selection.$from.node(1);
  return (
    topLevelNode.isTextblock &&
    topLevelNode.type !== state.schema.nodes.codeBlock &&
    topLevelNode.nodeSize === 2
  );
}

function canMoveUp(state: EditorState): boolean {
  const { selection } = state;
  /**
   * If there's a media element on the selection it will use a gap cursor to move
   */
  if (selection instanceof NodeSelection && isMediaNode(selection.node)) {
    return true;
  }

  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheBeginningOfDoc(state);
}

function canMoveDown(state: EditorState): boolean {
  const { selection } = state;

  /**
   * If there's a media element on the selection it will use a gap cursor to move
   */
  if (selection instanceof NodeSelection && isMediaNode(selection.node)) {
    return true;
  }
  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheEndOfDoc(state);
}

export function atTheEndOfDoc(state: EditorState): boolean {
  const { selection, doc } = state;
  return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}

export function atTheBeginningOfDoc(state: EditorState): boolean {
  const { selection } = state;
  return selection.$from.pos === selection.$from.depth;
}

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
