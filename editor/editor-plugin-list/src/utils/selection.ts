import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import {
  isListItemNode,
  isListNode,
  isParagraphNode,
} from '@atlaskit/editor-common/utils';
import type {
  NodeRange,
  NodeType,
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import type {
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';
import {
  findParentNodeOfType,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';

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

  let range;
  if (selection instanceof GapCursorSelection && $from.nodeAfter) {
    const nodeSize = $from.nodeAfter.nodeSize || 1;
    range = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
  } else {
    range = $from.blockRange($to);
  }
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
export const isInsideListItem = (tr: Transaction): boolean => {
  const { parent } = tr.selection.$from;
  const { listItem } = tr.doc.type.schema.nodes;

  if (tr.selection instanceof GapCursorSelection) {
    return isListItemNode(parent);
  }

  return hasParentNodeOfType(listItem)(tr.selection) && isParagraphNode(parent);
};

export const isInsideTableCell = (tr: Transaction): boolean => {
  const { tableCell, tableHeader } = tr.doc.type.schema.nodes;
  return !!findParentNodeOfType([tableCell, tableHeader])(tr.selection);
};

export const canJoinToPreviousListItem = (tr: Transaction): boolean => {
  const { $from } = tr.selection;

  const $before = tr.doc.resolve($from.pos - 1);
  let nodeBefore = $before ? $before.nodeBefore : null;

  if (tr.selection instanceof GapCursorSelection) {
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

type CreateNodeRange = (props: { selection: Selection }) => NodeRange | null;
export const createListNodeRange: CreateNodeRange = ({ selection }) => {
  const { $from, $to } = selection;
  const range = $from.blockRange($to, isListNode);
  if (!range) {
    return null;
  }

  return range;
};
