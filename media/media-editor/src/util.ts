import {
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { ANALYTICS_MEDIA_CHANNEL, ColorWithAlpha, Dimensions } from './common';
import { VeColor } from './engine/core/binaries/mediaEditor';

export const colorWithAlphaSame = (
  a: ColorWithAlpha,
  b: ColorWithAlpha,
): boolean => {
  return (
    a.red === b.red &&
    a.green === b.green &&
    a.blue === b.blue &&
    a.alpha === b.alpha
  );
};

export const dimensionsSame = (a: Dimensions, b: Dimensions): boolean => {
  return a.width === b.width && a.height === b.height;
};

// The editor core consumes and operates with UTF-32 strings.
// JavaScript uses UTF-16 encoding for string.
// The following two functions are necessary to get UTF-32 code units (numeric codes or as strings) from a JS string.
//
// In UTF-16 a code unit is two bytes.
// When we call String.charCodeAt() we get a UTF-16 code unit. String.length returns the number of UTF-16 code units.
//
// Most of the characters we use are encoded with one UTF-16 code unit and we translate it to UTF-32 easily: the code is the same.
// For example the letter 'a' is represented with the code 0x0061. The corresponding UTF-32 code is 0x00000061.
//
// Unfortunately there are characters that are represented with two UTF-16 code units.
// Their Unicode values are in the range 0x10000-0x10FFFF.
// In UTF-16 they are represented as surrogate pairs:
//   the first UTF-16 code unit is in range 0xD800-0xDBFF and is called a high surrogate;
//   the second UTF-16 code unit is in range 0xDC00-0xDFFF and is called a low surrogate.
//
// No character can be encoded with one UTF-16 code unit in the range 0xD800-0xDBFF. If we get such a code unit
// then it's always a high surrogate and to get the whole character we need the next UTF-16 code unit which is the low surrogate.
//
// To form a surrogate pair (according to UTF-16 encoding) we need:
// 1) Subtract 0x010000 from the Unicode code. The result will be in range 0-0xFFFFF, i.e. will contain 20 bits.
// 2) Get the top ten bits, add 0xD800. The result will be the high surrogate pair.
// 3) Get the low ten bits, add 0xDC00. The result will be the low surrogate pair.
//
// To get back (to get the UTF-32 code) we revert the operations:
// 1) top_ten_bits = high_surrogate - 0xD800
// 2) low_ten_bits = low_surrogate - 0xDC00
// 3) To shift ten bits left we multiply by 0x400, thus the result is
//
//    result = top_ten_bits * 0x400 + low_ten_bits + 0x10000 =
//           = (high_surrogate - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000
//
// More info:
// https://mathiasbynens.be/notes/javascript-encoding
// https://en.wikipedia.org/wiki/UTF-16

// Gets UTF-32 codes of a given string
export const getUtf32Codes = (text: string): Array<number> => {
  return splitText(
    text,
    code => code,
    (high, low) => (high - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000,
  );
};

// Splits a string to strings each of them is one Unicode character.
// We can't just split to UTF-16 code units because of surrogate pairs. For example,
// '\uD834\uDF06' is one Unicode character and should be represented as '\uD834\uDF06' or '\u{1D306}',
// but not ['\uD834', '\uDF06'].
export const getUtf32CodeUnits = (text: string): Array<string> => {
  return splitText(
    text,
    code => String.fromCharCode(code),
    (high, low) => String.fromCharCode(high, low),
  );
};

function splitText<T>(
  text: string,
  charCodeHandler: (code: number) => T,
  surrogatePairHandler: (high: number, low: number) => T,
): Array<T> {
  const result: Array<T> = [];

  for (let i = 0; i < text.length; ++i) {
    const current = text.charCodeAt(i);

    if (current >= 0xd800 && current <= 0xdbff && i < text.length - 1) {
      // high surrogate
      const next = text.charCodeAt(i + 1);
      ++i;

      if (next >= 0xdc00 && next <= 0xdfff) {
        // low surrogate
        result.push(surrogatePairHandler(current, next));
      } else {
        // the string is broken
        result.push(charCodeHandler(current), charCodeHandler(next));
      }
    } else {
      result.push(charCodeHandler(current));
    }
  }

  return result;
}

// The function adjusts the size of the 'elements' to the requiredSize.
// It can create some elements, or delete some. It uses the fuctions creator, deleter for this.
export function adjustSize<T>(
  elements: Array<T>,
  requiredSize: number,
  creator: () => T,
  deleter: (element: T) => void,
): void {
  const currentSize = elements.length;

  if (currentSize > requiredSize) {
    // We need to delete some elements
    const deleteStartIndex = requiredSize;
    elements.splice(deleteStartIndex).forEach(deleter);
  } else if (currentSize < requiredSize) {
    // We need to add some elements
    const numToAdd = requiredSize - currentSize;
    for (let i = 0; i < numToAdd; ++i) {
      elements.push(creator());
    }
  }
}

export const fileToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    // TODO: [ts30] Add proper handling for null and ArrayBuffer
    reader.onloadend = () => resolve(reader.result as string);
    reader.onabort = () => reject('abort');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/* eslint-disable no-bitwise */
export const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.substring(hex.indexOf('#') + 1), 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;

  return { red, green, blue };
};

export const rgbToHex = ({ red, green, blue }: VeColor) => {
  return (
    '#' +
    ((1 << 24) + (red << 16) + (green << 8) + blue)
      .toString(16)
      .slice(1)
      .toLowerCase()
  );
};
/* eslint-enable no-bitwise */

export function fireAnalyticsEvent(
  payload: AnalyticsEventPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void {
  if (createAnalyticsEvent) {
    createAnalyticsEvent(payload).fire(ANALYTICS_MEDIA_CHANNEL);
  }
}
