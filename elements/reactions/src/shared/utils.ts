import { type EmojiId } from '@atlaskit/emoji/types';
import { DefaultReactions } from './constants';

/**
 * Is selected mouse event a left click
 * @param event event data
 */
export const isLeftClick = (event: React.MouseEvent<HTMLElement>) =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

/**
 * Does provided item part of the default emoji ids
 * @param item selected emoji item
 */
export const isDefaultReaction = (item: EmojiId) =>
  DefaultReactions.some((otherEmojiId) => isEqualEmojiId(otherEmojiId, item));

/**
 * compare 2 emoji items if they are same input
 * @param a first emoji item
 * @param b second emoji item
 */
const isEqualEmojiId = (a: EmojiId | string, b: EmojiId | string): boolean => {
  if (isEmojiId(a) && isEmojiId(b)) {
    return a === b || (a && b && a.id === b.id && a.shortName === b.shortName);
  } else {
    return a === b;
  }
};

/**
 * Type guard if provided object is a string id or an object info collection for the emoji
 * @param item given item
 */
const isEmojiId = (item: EmojiId | string): item is EmojiId => {
  return (item as EmojiId).id !== undefined;
};

export const formatStringWithDecimal = (
  value: string,
  decimalPlaces: number,
) => {
  const decimalIndex = value.indexOf('.');

  if (decimalIndex === -1) {
    // Integers with trailing 0s will have no decimal (Ex. 18000, 7700000, 500)
    return value.substring(0, value.length);
  }

  if (decimalPlaces === 0) {
    // Return an integer value
    return value.substring(0, decimalIndex);
  }

  return value.substring(0, decimalIndex + decimalPlaces + 1);
};

/**
 * Truncates numbers >= 1000 to shorthand representations with a maximum of one decimal point.
 * If the first decimal number is a zero then it's also truncated.
 * (Ex: 9085 will return 9K, 787555 will return 787.5M)
 */
export const formatLargeNumber = (value: number) => {
  // 999M+
  const maxLimit = 999999999;
  const thounsandSeparator = 1000;
  const millionSeparator = 1000 * 1000;
  const valueInK = value / thounsandSeparator;
  const valueInM = value / millionSeparator;

  if (value > maxLimit) {
    return '999.9M+';
  }

  if (value >= 1000000) {
    // determine the decimal breakpoints by length and check its value
    // 1234567 -> 1.234567 and decimal value is 2
    const numDigits = value.toString().length;
    const decimalIndexValue = valueInM.toString().charAt(numDigits - 5);

    return decimalIndexValue === '0'
      ? formatStringWithDecimal(valueInM.toString(), 0) + 'M'
      : formatStringWithDecimal(valueInM.toString(), 1) + 'M';
  }

  if (value >= 1000) {
    const numDigits = value.toString().length;
    const decimalIndexValue = valueInK.toString().charAt(numDigits - 2);

    return decimalIndexValue === '0'
      ? formatStringWithDecimal(valueInK.toString(), 0) + 'K'
      : formatStringWithDecimal(valueInK.toString(), 1) + 'K';
  }

  // <999
  return value.toString();
};
