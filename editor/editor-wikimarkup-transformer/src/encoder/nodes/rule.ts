import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const rule: NodeEncoder = (_node: PMNode): string => {
  return '----';
};
