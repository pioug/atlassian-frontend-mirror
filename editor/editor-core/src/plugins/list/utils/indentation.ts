import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { numberNestedLists } from './selection';
import { isListItemNode, isListNode } from '@atlaskit/editor-common/utils';

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
