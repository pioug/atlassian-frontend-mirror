import { Selection, NodeSelection } from 'prosemirror-state';
import { findParentNode, ContentNodeWithPos } from 'prosemirror-utils';
import { isSupportedNodeForBreakout } from './is-supported-node';

/**
 * Find the nearest parent node to the selection that supports breakout, or if the nearest
 * matching parent node is the doc, return undefined.
 * For depth, if a node is selected and supports breakout, return the depth of the node.
 * @param selection Current editor selection
 */
export function findSupportedNodeForBreakout(
  selection: Selection,
): ContentNodeWithPos | undefined {
  if (selection instanceof NodeSelection) {
    const supportsBreakout = isSupportedNodeForBreakout(selection.node);
    if (supportsBreakout) {
      return {
        pos: selection.from,
        start: selection.from,
        node: selection.node,
        // If a selected expand is in a doc, the depth of that expand is 0. Therefore
        // we don't need to subtract 1 or instantly return false if the depth is 0
        depth: selection.$anchor.depth,
      };
    }
  }
  const breakoutNode = findParentNode(isSupportedNodeForBreakout)(selection);
  if (!breakoutNode || breakoutNode.depth === 0) {
    // If this node doesn't exist or the only supporting node is the document
    // (with depth 0), then we're not inside a node that supports breakout
    return undefined;
  }
  return {
    node: breakoutNode.node,
    start: breakoutNode.start,
    pos: breakoutNode.pos,
    depth: breakoutNode.depth - 1,
  };
}
