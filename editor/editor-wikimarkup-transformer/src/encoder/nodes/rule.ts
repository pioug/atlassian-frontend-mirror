import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder } from '..';

export const rule: NodeEncoder = (_node: PMNode): string => {
  return '----';
};
