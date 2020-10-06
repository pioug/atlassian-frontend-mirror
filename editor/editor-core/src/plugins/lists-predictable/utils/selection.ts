import { findWrapping } from 'prosemirror-transform';
import { Node as PMNode, ResolvedPos, NodeType } from 'prosemirror-model';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import {
  findParentNodeClosestToPos,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { GapCursorSelection } from '../../gap-cursor';
import { isListItemNode, isListNode, isParagraphNode } from './node';

export const isPosInsideParagraph = ($pos: ResolvedPos) => {
  return $pos.parent.type.name === 'paragraph';
};

export const isPosInsideList = ($pos: ResolvedPos) => {
  const posGrandParent = $pos.node(-1);

  return (
    isListItemNode($pos.parent) ||
    isListNode($pos.parent) ||
    isListItemNode(posGrandParent)
  );
};

export const isWrappingPossible = (
  nodeType: NodeType,
  selection: Selection,
) => {
  const { $from, $to } = selection;
  const range = $from.blockRange($to);
  if (!range) {
    return false;
  }

  const wrap = findWrapping(range, nodeType);
  if (!wrap) {
    return false;
  }

  return true;
};

// canOutdent
export const isInsideListItem = (state: EditorState): boolean => {
  const { parent } = state.selection.$from;
  const { listItem } = state.schema.nodes;

  if (state.selection instanceof GapCursorSelection) {
    return isListItemNode(parent);
  }

  return (
    hasParentNodeOfType(listItem)(state.selection) && isParagraphNode(parent)
  );
};

export const canJoinToPreviousListItem = (state: EditorState): boolean => {
  const { $from } = state.selection;

  const $before = state.doc.resolve($from.pos - 1);
  let nodeBefore = $before ? $before.nodeBefore : null;

  if (state.selection instanceof GapCursorSelection) {
    nodeBefore = $from.nodeBefore;
  }

  return isListNode(nodeBefore);
};

export const selectionContainsList = (tr: Transaction): PMNode | null => {
  const {
    selection: { from, to },
  } = tr;
  let foundListNode: PMNode | null = null;
  tr.doc.nodesBetween(from, to, node => {
    if (isListNode(node)) {
      foundListNode = node;
    }

    if (foundListNode) {
      return false;
    }

    return true;
  });
  return foundListNode;
};

export const numberNestedLists = (resolvedPos: ResolvedPos) => {
  let count = 0;
  for (let i = resolvedPos.depth - 1; i > 0; i--) {
    const node = resolvedPos.node(i);
    if (isListNode(node)) {
      count += 1;
    }
  }
  return count;
};

export const getListItemAttributes = ($pos: ResolvedPos) => {
  const indentLevel = numberNestedLists($pos) - 1;

  const itemAtPos = findParentNodeClosestToPos($pos, isListItemNode);

  // Get the index of the current item relative to parent (parent is at item depth - 1)
  const itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
  return { indentLevel, itemIndex };
};