import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { numberNestedLists } from './selection';
import { isListItemNode, isListNode } from './node';

// This will return (depth - 1) for root list parent of a list.
export const getListLiftTarget = (resPos: ResolvedPos): number => {
  let target = resPos.depth;
  for (let i = resPos.depth; i > 0; i--) {
    const node = resPos.node(i);
    if (isListNode(node)) {
      target = i;
    }
    if (!isListItemNode(node) && !isListNode(node)) {
      break;
    }
  }
  return target - 1;
};

export const getNextSiblingListItemPosition = (
  $pos: ResolvedPos,
): ResolvedPos | null => {
  let target = $pos.depth;
  let found = false;
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (isListItemNode(node)) {
      target = i;
      found = true;
    }
    if (found) {
      break;
    }
  }
  const listItemPosition = target - 1;
  const listItemNodePosition = $pos.doc.nodeAt(listItemPosition)?.nodeSize || 0;
  const nextListItemPosition = listItemPosition + listItemNodePosition;
  const nextListItemNode = $pos.doc.nodeAt(nextListItemPosition);

  if (nextListItemNode) {
    return $pos.doc.resolve(nextListItemPosition);
  }

  return null;
};

export const hasValidListIndentationLevel = ({
  tr,
  maxIndentation,
}: {
  tr: Transaction;
  maxIndentation: number;
}): boolean => {
  const initialIndentationLevel = numberNestedLists(tr.selection.$from);
  let currentIndentationLevel: number;
  let currentPos = tr.selection.$to.pos;
  do {
    const resolvedPos = tr.doc.resolve(currentPos);
    currentIndentationLevel = numberNestedLists(resolvedPos);
    if (currentIndentationLevel > maxIndentation) {
      return false;
    }
    currentPos++;
  } while (currentIndentationLevel >= initialIndentationLevel);

  return true;
};
