import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { textColor } from '../marks/color';
import { N80, P300, T300, R300, Y400, G300 } from '@atlaskit/theme/colors';

const color: { [key: string]: string } = {
  grey: N80,
  purple: P300,
  blue: T300,
  red: R300,
  yellow: Y400,
  green: G300,
};

export const status: NodeEncoder = (node: PMNode): string => {
  const text = `*[ ${node.attrs.text.toUpperCase()} ]*`;
  const newAttrs = { ...node.attrs };
  if (color[node.attrs.color]) {
    newAttrs.color = color[node.attrs.color];
  } else {
    newAttrs.color = color['grey'];
  }
  return textColor(text, newAttrs);
};
