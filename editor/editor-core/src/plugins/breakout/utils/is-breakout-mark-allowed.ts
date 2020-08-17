import { EditorState } from 'prosemirror-state';
import { findSupportedNodeForBreakout } from './find-breakout-node';

/**
 * Check if breakout should be allowed for the current selection. If a node is selected,
 * can this node be broken out, if text, can the enclosing parent node be broken out.
 *
 * Currently breakout of a node is not possible if it's nested in anything but the document, however
 * this logic supports this changing.
 */
export function isBreakoutMarkAllowed(state: EditorState) {
  if (!state.schema.marks.breakout) {
    return false;
  }
  const supportedNodeParent = findSupportedNodeForBreakout(state.selection);
  if (!supportedNodeParent) {
    return false;
  }
  // At the moment we can only breakout when the depth is 0, ie. doc is the only node
  // that supports breakout. This *could* change though.
  const parent = state.selection.$from.node(supportedNodeParent.depth);
  return parent.type.allowsMarkType(state.schema.marks.breakout);
}
