import { MarkEncoder } from '..';
import { baseMarkPattern } from './__base';

export const subsup: MarkEncoder = (
  text: string,
  attrs: { type: 'sub' | 'sup' },
): string => {
  if (attrs.type === 'sub') {
    return baseMarkPattern(text, '~');
  } else {
    return baseMarkPattern(text, '^');
  }
};
