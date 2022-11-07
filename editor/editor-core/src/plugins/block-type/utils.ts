import { Node as PMNode } from 'prosemirror-model';
import { WRAPPER_BLOCK_TYPES } from './types';

export const isNodeAWrappingBlockNode = (node?: PMNode | null) => {
  if (!node) {
    return false;
  }
  return WRAPPER_BLOCK_TYPES.some(
    (blockNode) => blockNode.name === node.type.name,
  );
};
