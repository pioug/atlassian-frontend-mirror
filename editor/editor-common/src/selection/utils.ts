import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { GapCursorSelection } from './gap-cursor/selection';

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

export function atTheEndOfDoc(state: EditorState): boolean {
  const { selection, doc } = state;
  return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}

export function atTheBeginningOfDoc(state: EditorState): boolean {
  const { selection } = state;
  return selection.$from.pos === selection.$from.depth;
}

export function atTheEndOfBlock(state: EditorState): boolean {
  const { selection } = state;
  const { $to } = selection;
  if (selection instanceof GapCursorSelection) {
    return false;
  }
  if (selection instanceof NodeSelection && selection.node.isBlock) {
    return true;
  }
  return endPositionOfParent($to) === $to.pos + 1;
}

export function atTheBeginningOfBlock(state: EditorState): boolean {
  const { selection } = state;
  const { $from } = selection;
  if (selection instanceof GapCursorSelection) {
    return false;
  }
  if (selection instanceof NodeSelection && selection.node.isBlock) {
    return true;
  }
  return startPositionOfParent($from) === $from.pos;
}

export function startPositionOfParent(resolvedPos: ResolvedPos): number {
  return resolvedPos.start(resolvedPos.depth);
}

export function endPositionOfParent(resolvedPos: ResolvedPos): number {
  return resolvedPos.end(resolvedPos.depth) + 1;
}
