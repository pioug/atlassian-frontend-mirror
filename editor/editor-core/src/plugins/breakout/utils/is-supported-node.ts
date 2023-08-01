import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

const supportedNodesForBreakout = ['codeBlock', 'layoutSection', 'expand'];

/**
 * Check if breakout can be applied to a node
 * @param node Node to check
 */
export function isSupportedNodeForBreakout(node: PMNode): boolean {
  return supportedNodesForBreakout.indexOf(node.type.name) !== -1;
}
