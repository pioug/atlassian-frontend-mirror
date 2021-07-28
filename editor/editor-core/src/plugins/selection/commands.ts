import { NodeSelection, TextSelection, Selection } from 'prosemirror-state';
import { Node as PmNode, ResolvedPos } from 'prosemirror-model';

import { GapCursorSelection, Side } from './gap-cursor-selection';
import { isIgnored as isIgnoredByGapCursor } from '../selection/gap-cursor/utils/is-ignored';
import { isNodeEmpty, isEmptyParagraph } from '../../utils/document';
import { Command } from '../../types';

import { SelectionActionTypes } from './actions';
import { createCommand, getPluginState } from './plugin-factory';
import {
  isSelectableContainerNode,
  isSelectionAtEndOfParentNode,
  findSelectableContainerParent,
  isSelectionAtStartOfParentNode,
  findSelectableContainerBefore,
  findSelectableContainerAfter,
  findFirstChildNodeToSelect,
  findLastChildNodeToSelect,
} from './utils';
import { RelativeSelectionPos, SelectionDirection } from './types';

export const setSelectionRelativeToNode = (
  selectionRelativeToNode?: RelativeSelectionPos,
  selection?: Selection | null,
) =>
  createCommand(
    {
      type: SelectionActionTypes.SET_RELATIVE_SELECTION,
      selectionRelativeToNode,
    },
    (tr) => {
      if (selection) {
        return tr.setSelection(selection);
      }
      return tr;
    },
  );

export const arrowRight: Command = (state, dispatch) => {
  const { selection } = state;

  if (selection instanceof GapCursorSelection) {
    return arrowRightFromGapCursor(selection)(state, dispatch);
  } else if (selection instanceof NodeSelection) {
    return arrowRightFromNode(selection)(state, dispatch);
  } else if (selection instanceof TextSelection) {
    return arrowRightFromText(selection)(state, dispatch);
  }

  return false;
};

export const arrowLeft: Command = (state, dispatch) => {
  const { selection } = state;

  if (selection instanceof GapCursorSelection) {
    return arrowLeftFromGapCursor(selection)(state, dispatch);
  } else if (selection instanceof NodeSelection) {
    return arrowLeftFromNode(selection)(state, dispatch);
  } else if (selection instanceof TextSelection) {
    return arrowLeftFromText(selection)(state, dispatch);
  }

  return false;
};

const arrowRightFromGapCursor = (selection: GapCursorSelection): Command => (
  state,
  dispatch,
) => {
  const { $from, $to, side } = selection;

  if (side === Side.LEFT) {
    const selectableNode = findSelectableContainerAfter($to, state.doc);
    if (selectableNode) {
      return setSelectionRelativeToNode(
        RelativeSelectionPos.Start,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  } else if (
    side === Side.RIGHT &&
    isSelectionAtEndOfParentNode($from, selection)
  ) {
    const selectableNode = findSelectableContainerParent(selection);
    if (selectableNode) {
      return setSelectionRelativeToNode(
        RelativeSelectionPos.End,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  }

  return false;
};

const arrowLeftFromGapCursor = (selection: GapCursorSelection): Command => (
  state,
  dispatch,
) => {
  const { $from, side } = selection;
  const { selectionRelativeToNode } = getPluginState(state);

  if (side === Side.RIGHT) {
    const selectableNode = findSelectableContainerBefore($from, state.doc);
    if (selectableNode) {
      return setSelectionRelativeToNode(
        RelativeSelectionPos.End,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  } else if (
    side === Side.LEFT &&
    isSelectionAtStartOfParentNode($from, selection)
  ) {
    if (selectionRelativeToNode === RelativeSelectionPos.Before) {
      const $parent = state.doc.resolve(
        selection.$from.before(selection.$from.depth),
      );
      if ($parent) {
        const selectableNode = findSelectableContainerBefore(
          $parent,
          state.doc,
        );
        if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
          // selection is inside node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
          return setSelectionRelativeToNode(
            RelativeSelectionPos.End,
            NodeSelection.create(state.doc, selectableNode.pos),
          )(state, dispatch);
        }
      }
      // we don't return this as we want to reset the relative pos, but not block other plugins
      // from responding to arrow left key
      setSelectionRelativeToNode()(state, dispatch);
    } else {
      const selectableNode = findSelectableContainerParent(selection);
      if (selectableNode) {
        return setSelectionRelativeToNode(
          RelativeSelectionPos.Start,
          NodeSelection.create(state.doc, selectableNode.pos),
        )(state, dispatch);
      }
    }
  }

  return false;
};

const arrowRightFromNode = (selection: NodeSelection): Command => (
  state,
  dispatch,
) => {
  const { node, from, $to } = selection;
  const { selectionRelativeToNode } = getPluginState(state);

  if (node.isAtom) {
    if (isSelectionAtEndOfParentNode($to, selection)) {
      // selection is for inline node that is the last child of its parent node - set text selection after it
      return findAndSetTextSelection(
        RelativeSelectionPos.End,
        state.doc.resolve(from + 1),
        SelectionDirection.After,
      )(state, dispatch);
    }
    return false;
  } else if (selectionRelativeToNode === RelativeSelectionPos.Start) {
    // selection is for container node - set selection inside it at the start
    return setSelectionInsideAtNodeStart(
      RelativeSelectionPos.Inside,
      node,
      from,
    )(state, dispatch);
  } else if (
    isIgnoredByGapCursor(node) &&
    (!selectionRelativeToNode ||
      selectionRelativeToNode === RelativeSelectionPos.End)
  ) {
    const selectableNode = findSelectableContainerAfter($to, state.doc);
    if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
      // selection is for node without gap cursor followed by another node without gap cursor - set node selection for next node
      return setSelectionRelativeToNode(
        RelativeSelectionPos.Start,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  }

  return false;
};

const arrowLeftFromNode = (selection: NodeSelection): Command => (
  state,
  dispatch,
) => {
  const { node, from, to, $from } = selection;
  const { selectionRelativeToNode } = getPluginState(state);

  if (node.isAtom) {
    if (isSelectionAtStartOfParentNode($from, selection)) {
      // selection is for inline node that is the first child of its parent node - set text selection before it
      return findAndSetTextSelection(
        RelativeSelectionPos.Start,
        state.doc.resolve(from),
        SelectionDirection.Before,
      )(state, dispatch);
    }
    return false;
  } else if (selectionRelativeToNode === RelativeSelectionPos.End) {
    // selection is for container node - set selection inside it at the end
    return setSelectionInsideAtNodeEnd(
      RelativeSelectionPos.Inside,
      node,
      from,
      to,
    )(state, dispatch);
  } else if (
    !selectionRelativeToNode ||
    selectionRelativeToNode === RelativeSelectionPos.Inside
  ) {
    // selection is for container node - set selection inside it at the start
    // (this is a special case when the user selects by clicking node)
    return setSelectionInsideAtNodeStart(
      RelativeSelectionPos.Before,
      node,
      from,
    )(state, dispatch);
  } else if (
    isIgnoredByGapCursor(node) &&
    selectionRelativeToNode === RelativeSelectionPos.Start
  ) {
    // selection is for node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
    const selectableNode = findSelectableContainerBefore($from, state.doc);
    if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
      return setSelectionRelativeToNode(
        RelativeSelectionPos.End,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  }

  return false;
};

const arrowRightFromText = (selection: TextSelection): Command => (
  state,
  dispatch,
) => {
  if (isSelectionAtEndOfParentNode(selection.$to, selection)) {
    const selectableNode = findSelectableContainerParent(selection);
    if (selectableNode) {
      return setSelectionRelativeToNode(
        RelativeSelectionPos.End,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  }

  return false;
};

const arrowLeftFromText = (selection: TextSelection): Command => (
  state,
  dispatch,
) => {
  const { selectionRelativeToNode } = getPluginState(state);

  if (selectionRelativeToNode === RelativeSelectionPos.Before) {
    const selectableNode = findSelectableContainerBefore(
      selection.$from,
      state.doc,
    );
    if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
      // selection is inside node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
      return setSelectionRelativeToNode(
        RelativeSelectionPos.End,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
    // we don't return this as we want to reset the relative pos, but not block other plugins
    // from responding to arrow left key
    setSelectionRelativeToNode(undefined)(state, dispatch);
  } else if (isSelectionAtStartOfParentNode(selection.$from, selection)) {
    const selectableNode = findSelectableContainerParent(selection);
    if (selectableNode) {
      return setSelectionRelativeToNode(
        RelativeSelectionPos.Start,
        NodeSelection.create(state.doc, selectableNode.pos),
      )(state, dispatch);
    }
  }

  return false;
};

const findAndSetTextSelection = (
  selectionRelativeToNode: RelativeSelectionPos | undefined,
  $pos: ResolvedPos,
  dir: SelectionDirection,
): Command => (state, dispatch) => {
  const sel = Selection.findFrom($pos, dir, true);
  if (sel) {
    return setSelectionRelativeToNode(selectionRelativeToNode, sel)(
      state,
      dispatch,
    );
  }
  return false;
};

const setSelectionInsideAtNodeStart = (
  selectionRelativeToNode: RelativeSelectionPos | undefined,
  node: PmNode,
  pos: number,
): Command => (state, dispatch) => {
  if (isNodeEmpty(node)) {
    return findAndSetTextSelection(
      selectionRelativeToNode,
      state.doc.resolve(pos),
      SelectionDirection.After,
    )(state, dispatch);
  }

  const selectableNode = findFirstChildNodeToSelect(node);
  if (selectableNode) {
    const { node: childNode, pos: childPos } = selectableNode;
    const selectionPos = pos + childPos + 1;
    if (childNode.isText || childNode.isAtom) {
      return findAndSetTextSelection(
        selectionRelativeToNode,
        state.doc.resolve(selectionPos),
        SelectionDirection.Before,
      )(state, dispatch);
    } else if (isEmptyParagraph(childNode)) {
      return findAndSetTextSelection(
        selectionRelativeToNode,
        state.doc.resolve(selectionPos + 1),
        SelectionDirection.Before,
      )(state, dispatch);
    } else if (!isIgnoredByGapCursor(node)) {
      return setSelectionRelativeToNode(
        selectionRelativeToNode,
        new GapCursorSelection(state.doc.resolve(selectionPos), Side.LEFT),
      )(state, dispatch);
    } else if (isSelectableContainerNode(node)) {
      return setSelectionRelativeToNode(
        selectionRelativeToNode,
        NodeSelection.create(state.doc, selectionPos),
      )(state, dispatch);
    }
  }
  return false;
};

export const setSelectionInsideAtNodeEnd = (
  selectionRelativeToNode: RelativeSelectionPos,
  node: PmNode,
  from: number,
  to: number,
): Command => (state, dispatch) => {
  if (isNodeEmpty(node)) {
    return findAndSetTextSelection(
      selectionRelativeToNode,
      state.doc.resolve(to),
      SelectionDirection.Before,
    )(state, dispatch);
  }

  const selectableNode = findLastChildNodeToSelect(node);
  if (selectableNode) {
    const { node: childNode, pos: childPos } = selectableNode;
    const selectionPos = from + childPos + childNode.nodeSize;
    if (childNode.isText || childNode.isAtom) {
      return findAndSetTextSelection(
        selectionRelativeToNode,
        state.doc.resolve(selectionPos + 1),
        SelectionDirection.After,
      )(state, dispatch);
    } else if (isEmptyParagraph(childNode)) {
      return findAndSetTextSelection(
        selectionRelativeToNode,
        state.doc.resolve(selectionPos),
        SelectionDirection.After,
      )(state, dispatch);
    } else if (!isIgnoredByGapCursor(node)) {
      return setSelectionRelativeToNode(
        selectionRelativeToNode,
        new GapCursorSelection(state.doc.resolve(selectionPos + 1), Side.RIGHT),
      )(state, dispatch);
    } else if (isSelectableContainerNode(node)) {
      return setSelectionRelativeToNode(
        selectionRelativeToNode,
        NodeSelection.create(state.doc, selectionPos),
      )(state, dispatch);
    }
  }
  return false;
};
