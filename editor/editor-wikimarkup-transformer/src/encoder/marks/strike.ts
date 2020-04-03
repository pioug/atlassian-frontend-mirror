import { MarkEncoder } from '..';
import { baseMarkPattern } from './__base';

export const strike: MarkEncoder = (text: string): string => {
  return baseMarkPattern(text, '-');
};
