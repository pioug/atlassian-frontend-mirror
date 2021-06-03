import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';

import { inlines } from './inlines';

export const paragraph: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  let result = '';
  node.forEach((n) => {
    result += inlines(n, { context });
  });

  return result;
};
