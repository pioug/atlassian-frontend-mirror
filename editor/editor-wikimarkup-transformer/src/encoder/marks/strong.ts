import { MarkEncoder } from '..';
import { baseMarkPattern } from './__base';

/**
 * For text that has leading and ending space. We don't want to
 * convert it to `*strong *. Instead, we need it to be `*strong* `
 */
export const strong: MarkEncoder = (text: string): string => {
  return baseMarkPattern(text, '*');
};
