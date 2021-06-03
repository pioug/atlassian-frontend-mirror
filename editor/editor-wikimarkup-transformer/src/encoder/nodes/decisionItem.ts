import { Node as PMNode } from 'prosemirror-model';

import { inlines } from './inlines';
import { NodeEncoderOpts } from '..';

export const decisionItem = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  let result: string = '';
  node.forEach((n) => {
    result += `* <> ${inlines(n, { context })}`;
  });
  return result;
};
