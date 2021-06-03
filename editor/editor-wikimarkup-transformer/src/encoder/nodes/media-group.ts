import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';
import { media } from './media';

export const mediaGroup: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  const result: string[] = [];
  node.forEach((n) => {
    result.push(media(n, { context, parent: node }));
  });

  return result.join('\n');
};
