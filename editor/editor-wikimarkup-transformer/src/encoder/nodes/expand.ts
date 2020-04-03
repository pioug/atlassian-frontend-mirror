import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder } from '..';

export const expand: NodeEncoder = (node: PMNode): string => {
  // Title of expand appears as a bold text, followed by empty line
  const result: string[] = [`*${node.attrs.title}*`, ''];

  node.forEach(n => {
    result.push(encode(n));
  });
  return result.join('\n');
};
