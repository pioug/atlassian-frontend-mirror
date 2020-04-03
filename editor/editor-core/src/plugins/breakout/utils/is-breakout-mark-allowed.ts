import { EditorState } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { isSupportedNodeForBreakout } from './is-supported-node';

export function isBreakoutMarkAllowed(state: EditorState) {
  if (!state.schema.marks.breakout) {
    return false;
  }

  const node = findParentNode(isSupportedNodeForBreakout)(state.selection);

  if (!node || node.depth === 0) {
    return false;
  }

  const parent = state.selection.$from.node(node.depth - 1);
  return parent.type.allowsMarkType(state.schema.marks.breakout);
}
