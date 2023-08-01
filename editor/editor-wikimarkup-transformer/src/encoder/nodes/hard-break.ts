import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeEncoder } from '..';

export const hardBreak: NodeEncoder = (_node: PMNode): string => {
  return '\n';
};
