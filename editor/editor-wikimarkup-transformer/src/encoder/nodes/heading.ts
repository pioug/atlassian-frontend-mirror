import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder } from '..';

import { inlines } from './inlines';

export const heading: NodeEncoder = (node: PMNode): string => {
  let result = '';

  node.forEach((n) => {
    result += inlines(n);
  });

  return `h${node.attrs.level}. ${result}`;
};
