import { MarkEncoder } from '..';
import { baseMarkPattern } from './__base';

export const underline: MarkEncoder = (text: string): string => {
  return baseMarkPattern(text, '+');
};
