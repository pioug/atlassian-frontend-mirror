import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder } from '..';

export const blockquote: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(encode(n));
  });
  return `{quote}${result.join('\n\n')}{quote}`;
};
