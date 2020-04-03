import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { textColor } from '../marks/color';

export const status: NodeEncoder = (node: PMNode): string => {
  const text = `*[ ${node.attrs.text.toUpperCase()} ]*`;
  const newAttrs = { ...node.attrs };
  if (node.attrs.color === 'neutral') {
    newAttrs.color = 'grey';
  }
  return textColor(text, newAttrs);
};
