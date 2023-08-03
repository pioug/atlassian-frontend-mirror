import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
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
