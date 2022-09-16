import { ResolvedPos } from 'prosemirror-model';
import { ContentNodeWithPos } from 'prosemirror-utils';

export const isSelectionAtStartOfNode = (
  $pos: ResolvedPos,
  parentNode?: ContentNodeWithPos,
): boolean => {
  if (!parentNode) {
    return false;
  }

  for (let i = $pos.depth + 1; i > 0; i--) {
    const node = $pos.node(i);
    if (node && node.eq(parentNode.node)) {
      break;
    }

    if (i > 1 && $pos.before(i) !== $pos.before(i - 1) + 1) {
      return false;
    }
  }

  return true;
};

export const isSelectionAtEndOfNode = (
  $pos: ResolvedPos,
  parentNode?: ContentNodeWithPos,
): boolean => {
  if (!parentNode) {
    return false;
  }

  for (let i = $pos.depth + 1; i > 0; i--) {
    const node = $pos.node(i);
    if (node && node.eq(parentNode.node)) {
      break;
    }

    if (i > 1 && $pos.after(i) !== $pos.after(i - 1) - 1) {
      return false;
    }
  }

  return true;
};
