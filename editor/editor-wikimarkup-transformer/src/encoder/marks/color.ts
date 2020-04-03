import { MarkEncoder } from '..';

export const textColor: MarkEncoder = (
  text: string,
  attrs: { color: string },
): string => {
  return `{color:${attrs.color}}${text}{color}`;
};
