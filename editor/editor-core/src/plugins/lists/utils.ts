import { findWrapping } from 'prosemirror-transform';
import { Schema, ResolvedPos, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { GapCursorSelection } from '../selection/gap-cursor-selection';

export const isWrappingPossible = (nodeType: NodeType, state: EditorState) => {
  const { $from, $to } = state.selection;
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

export const isPosInsideParagraph = ($pos: ResolvedPos) => {
  return $pos.parent.type.name === 'paragraph';
};

export const isPosInsideList = ($pos: ResolvedPos) => {
  const posParentTypeName = $pos.parent.type.name;
  const posGrandParent = $pos.node(-1);

  return (
    posParentTypeName === 'listItem' ||
    posParentTypeName === 'orderedList' ||
    posParentTypeName === 'bulletList' ||
    (posGrandParent && posGrandParent.type.name === 'listItem')
  );
};

export const isInsideListItem = (state: EditorState): boolean => {
  const { $from } = state.selection;
  const { listItem, paragraph } = state.schema.nodes;

  if (state.selection instanceof GapCursorSelection) {
    return $from.parent.type === listItem;
  }

  return (
    hasParentNodeOfType(listItem)(state.selection) &&
    $from.parent.type === paragraph
  );
};

export const canJoinToPreviousListItem = (state: EditorState): boolean => {
  const { $from } = state.selection;
  const { bulletList, orderedList } = state.schema.nodes;

  const $before = state.doc.resolve($from.pos - 1);
  let nodeBefore = $before ? $before.nodeBefore : null;

  if (state.selection instanceof GapCursorSelection) {
    nodeBefore = $from.nodeBefore;
  }

  return (
    !!nodeBefore && [bulletList, orderedList].indexOf(nodeBefore.type) > -1
  );
};

export const canOutdent = (state: EditorState): boolean => {
  const { parent } = state.selection.$from;
  const { listItem, paragraph } = state.schema.nodes;

  if (state.selection instanceof GapCursorSelection) {
    return parent.type === listItem;
  }

  return (
    parent.type === paragraph && hasParentNodeOfType(listItem)(state.selection)
  );
};

// This will return (depth - 1) for root list parent of a list.
export const getListLiftTarget = (
  schema: Schema,
  resPos: ResolvedPos,
): number => {
  let target = resPos.depth;
  const { bulletList, orderedList, listItem } = schema.nodes;
  for (let i = resPos.depth; i > 0; i--) {
    const node = resPos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      target = i;
    }
    if (
      node.type !== bulletList &&
      node.type !== orderedList &&
      node.type !== listItem
    ) {
      break;
    }
  }
  return target - 1;
};
