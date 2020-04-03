import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const date: NodeEncoder = (node: PMNode): string => {
  const addLeadingZero = (val: number) => {
    if (val < 10) {
      return `0${val}`;
    }
    return val;
  };

  const result = new Date(Number(node.attrs.timestamp));
  return `{{${result.getUTCFullYear()}-${addLeadingZero(
    result.getUTCMonth() + 1,
  )}-${addLeadingZero(result.getUTCDate())}}}`;
};
