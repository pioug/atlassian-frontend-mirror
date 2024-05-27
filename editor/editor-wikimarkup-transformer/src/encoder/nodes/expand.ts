import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { encode, type NodeEncoder, type NodeEncoderOpts } from '..';

export const expand: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  // Title of expand appears as a bold text, followed by empty line
  const result: string[] = [`*${node.attrs.title}*`, ''];

  node.forEach((n) => {
    result.push(encode(n, context));
  });
  return result.join('\n');
};
