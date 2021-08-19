import {
  Fragment,
  Node as PMNode,
  NodeType,
  MarkType,
  Schema,
} from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { canMoveDown, canMoveUp } from '../utils';
import { Command } from '../types';
import {
  withAnalytics,
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '../plugins/analytics';
import { AlignmentState } from '../plugins/alignment/pm-plugins/types';

export function preventDefault(): Command {
  return function () {
    return true;
  };
}

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

export const insertNewLineWithAnalytics = withAnalytics({
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

export function addParagraphAtEnd(tr: Transaction) {
  const {
    doc: {
      type: {
        schema: {
          nodes: { paragraph },
        },
      },
    },
    doc,
  } = tr;
  if (
    doc.lastChild &&
    !(doc.lastChild.type === paragraph && doc.lastChild.content.size === 0)
  ) {
    if (paragraph) {
      tr.insert(doc.content.size, paragraph.createAndFill() as PMNode);
    }
  }
  tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size - 1));
  tr.scrollIntoView();
}

export function createParagraphAtEnd(): Command {
  return function (state, dispatch) {
    const { tr } = state;
    addParagraphAtEnd(tr);
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

export const changeImageAlignment = (align?: AlignmentState): Command => (
  state,
  dispatch,
) => {
  const { from, to } = state.selection;

  const tr = state.tr;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === state.schema.nodes.mediaSingle) {
      tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        layout: align === 'center' ? 'center' : `align-${align}`,
      });
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr.scrollIntoView());
    return true;
  }

  return false;
};

export const createToggleBlockMarkOnRange = <T = object>(
  markType: MarkType,
  getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
  allowedBlocks?:
    | Array<NodeType>
    | ((schema: Schema, node: PMNode, parent: PMNode) => boolean),
) => (
  from: number,
  to: number,
  tr: Transaction,
  state: EditorState,
): boolean => {
  let markApplied = false;
  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (!node.type.isBlock) {
      return false;
    }

    if (
      (!allowedBlocks ||
        (Array.isArray(allowedBlocks)
          ? allowedBlocks.indexOf(node.type) > -1
          : allowedBlocks(state.schema, node, parent))) &&
      parent.type.allowsMarkType(markType)
    ) {
      const oldMarks = node.marks.filter((mark) => mark.type === markType);

      const prevAttrs = oldMarks.length ? (oldMarks[0].attrs as T) : undefined;
      const newAttrs = getAttrs(prevAttrs, node);

      if (newAttrs !== undefined) {
        tr.setNodeMarkup(
          pos,
          node.type,
          node.attrs,
          node.marks
            .filter((mark) => !markType.excludes(mark.type))
            .concat(newAttrs === false ? [] : markType.create(newAttrs)),
        );
        markApplied = true;
      }
    }
    return;
  });
  return markApplied;
};

/**
 * Toggles block mark based on the return type of `getAttrs`.
 * This is similar to ProseMirror's `getAttrs` from `AttributeSpec`
 * return `false` to remove the mark.
 * return `undefined for no-op.
 * return an `object` to update the mark.
 */
export const toggleBlockMark = <T = object>(
  markType: MarkType,
  getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
  allowedBlocks?:
    | Array<NodeType>
    | ((schema: Schema, node: PMNode, parent: PMNode) => boolean),
): Command => (state, dispatch) => {
  let markApplied = false;
  const tr = state.tr;

  const toggleBlockMarkOnRange = createToggleBlockMarkOnRange(
    markType,
    getAttrs,
    allowedBlocks,
  );

  if (state.selection instanceof CellSelection) {
    state.selection.forEachCell((cell, pos) => {
      markApplied = toggleBlockMarkOnRange(pos, pos + cell.nodeSize, tr, state);
    });
  } else {
    const { from, to } = state.selection;
    markApplied = toggleBlockMarkOnRange(from, to, tr, state);
  }

  if (markApplied && tr.docChanged) {
    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }
    return true;
  }

  return false;
};

export const clearEditorContent: Command = (state, dispatch) => {
  const tr = state.tr;
  tr.replace(0, state.doc.nodeSize - 2);
  tr.setSelection(Selection.atStart(tr.doc));

  if (dispatch) {
    dispatch(tr);
    return true;
  }

  return false;
};
