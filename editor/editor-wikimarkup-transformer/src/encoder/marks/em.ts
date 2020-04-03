import { MarkEncoder } from '..';
import { baseMarkPattern } from './__base';

export const em: MarkEncoder = (text: string): string => {
  if (text.startsWith('— ')) {
    // This is a citation
    return baseMarkPattern(text.substring(2), '??');
  }
  return baseMarkPattern(text, '_');
};
