import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { encode, NodeEncoder, NodeEncoderOpts } from '..';

export const blockquote: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  const result: string[] = [];
  node.forEach((n) => {
    result.push(encode(n, context));
  });
  return `{quote}${result.join('\n\n')}{quote}`;
};
