import { Node as PMNode } from 'prosemirror-model';

const supportedNodesForBreakout = ['codeBlock', 'layoutSection', 'expand'];

export function isSupportedNodeForBreakout(node: PMNode): boolean {
  return supportedNodesForBreakout.indexOf(node.type.name) !== -1;
}
