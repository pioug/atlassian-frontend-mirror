import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { encode, type NodeEncoder, type NodeEncoderOpts } from '../';

export const doc: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  const result: string[] = [];

  node.forEach((n) => {
    result.push(encode(n, context));
  });

  return result.join('\n\n');
};
