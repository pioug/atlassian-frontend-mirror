import type {
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import {
  NodeSelection,
  Selection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';

import { isListItemNode, isListNode } from '../utils';

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
  // Get level for the correct indent of nesting
  const indentLevel = numberNestedLists($pos) - 1;

  const itemAtPos = findParentNodeClosestToPos($pos, isListItemNode);

  // Get the index of the current item relative to parent (parent is at item depth - 1)
  const itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
  return { indentLevel, itemIndex };
};

type NormalizeListItemsSelection = (props: {
  selection: Selection;
  doc: PMNode;
}) => Selection;
export const normalizeListItemsSelection: NormalizeListItemsSelection = ({
  selection,
  doc,
}) => {
  if (selection.empty) {
    return selection;
  }

  const { $from, $to } = selection;

  if (selection instanceof NodeSelection) {
    const head = resolvePositionToStartOfListItem($from);
    return new TextSelection(head, head);
  }

  const head = resolvePositionToStartOfListItem($from);
  const anchor = resolvePositionToEndOfListItem($to);

  return new TextSelection(anchor, head);
};

const resolvePositionToStartOfListItem = ($pos: ResolvedPos): ResolvedPos => {
  const fromRange = $pos.blockRange($pos, isListItemNode);
  const fromPosition =
    fromRange && $pos.textOffset === 0 && fromRange.end - 1 === $pos.pos
      ? Selection.near($pos.doc.resolve(fromRange.end + 1), 1).$from
      : $pos;

  return fromPosition;
};

const resolvePositionToEndOfListItem = ($pos: ResolvedPos): ResolvedPos => {
  const toRange = $pos.blockRange($pos, isListItemNode);
  const toPosition =
    toRange && $pos.textOffset === 0 && toRange.start + 1 === $pos.pos
      ? Selection.near($pos.doc.resolve(toRange.start - 1), -1).$to
      : $pos;

  return toPosition;
};
