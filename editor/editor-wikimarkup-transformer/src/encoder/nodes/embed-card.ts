import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { unknown } from './unknown';

export const embedCard: NodeEncoder = (node: PMNode): string => {
  if (!node.attrs.url) {
    return unknown(node);
  }

  return `[${node.attrs.url}|${node.attrs.url}|smart-embed]`;
};
