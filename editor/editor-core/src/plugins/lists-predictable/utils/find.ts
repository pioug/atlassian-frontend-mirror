import {
  findParentNodeClosestToPos,
  ContentNodeWithPos,
} from 'prosemirror-utils';
import { ResolvedPos, Node as PMNode } from 'prosemirror-model';
import { isListNode, isListItemNode } from './node';

export function findFirstNestedList($pos: ResolvedPos): ResolvedPos | null {
  const currentNode = $pos.doc.nodeAt($pos.pos);
  let currentListItemPos: number | null = null;
  if (isListItemNode(currentNode)) {
    currentListItemPos = $pos.pos;
  } else {
    const result = findParentNodeClosestToPos($pos, isListItemNode);
    currentListItemPos = result?.pos || null;
  }

  if (!currentListItemPos) {
    return null;
  }
  const currentListItemNode = $pos.doc.nodeAt(currentListItemPos);
  if (!currentListItemNode) {
    return null;
  }
  const lastListItemChild = currentListItemNode.child(
    currentListItemNode.childCount - 1,
  );

  if (!isListNode(lastListItemChild)) {
    return null;
  }

  const firstNestedListPosition =
    currentListItemNode.nodeSize - lastListItemChild.nodeSize;
  const firstNestedListNode = $pos.doc.nodeAt(firstNestedListPosition);
  if (!isListNode(firstNestedListNode)) {
    return null;
  }

  return $pos.doc.resolve(firstNestedListPosition);
}

export function findFirstParentListNode(
  $pos: ResolvedPos,
): {
  pos: number;
  node: PMNode;
} | null {
  const currentNode = $pos.doc.nodeAt($pos.pos);
  let listNodePosition: number | undefined | null = null;
  if (isListNode(currentNode)) {
    listNodePosition = $pos.pos;
  } else {
    const result = findParentNodeClosestToPos($pos, isListNode);
    listNodePosition = result && result.pos;
  }

  if (listNodePosition == null) {
    return null;
  }
  const node = $pos.doc.nodeAt(listNodePosition);

  if (!node) {
    return null;
  }

  return { node, pos: listNodePosition };
}

export function findFirstParentListItemNode(
  $pos: ResolvedPos,
): {
  pos: number;
  node: PMNode;
} | null {
  const currentNode = $pos.doc.nodeAt($pos.pos);

  const listItemNodePosition:
    | ResolvedPos
    | ContentNodeWithPos
    | undefined = isListItemNode(currentNode)
    ? $pos
    : findParentNodeClosestToPos($pos, isListItemNode);

  if (!listItemNodePosition || listItemNodePosition.pos === null) {
    return null;
  }

  const node = $pos.doc.nodeAt(listItemNodePosition.pos);

  if (!node) {
    return null;
  }

  return {
    node: node,
    pos: listItemNodePosition.pos,
  };
}

export function findRootParentListNode($pos: ResolvedPos): ResolvedPos | null {
  const { doc } = $pos;

  if ($pos.pos + 1 > doc.content.size) {
    return null;
  }

  if ($pos.depth === 0) {
    return doc.resolve($pos.pos + 1);
  }

  const currentNode = doc.nodeAt($pos.pos);
  const beforePosition = $pos.before();
  const nodeBefore = doc.nodeAt(beforePosition);

  if (isListNode(currentNode) && !isListItemNode(nodeBefore)) {
    return doc.resolve($pos.pos + 1);
  }

  const parentList = findParentNodeClosestToPos($pos, isListNode);

  if (!parentList) {
    return null;
  }
  const listNodePosition = doc.resolve(parentList.pos);

  return findRootParentListNode(listNodePosition);
}
