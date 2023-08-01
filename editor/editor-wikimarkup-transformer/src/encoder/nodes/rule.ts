import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeEncoder } from '..';

export const rule: NodeEncoder = (_node: PMNode): string => {
  return '----';
};
