import type { LengthGuide } from './types';

/**
 * This creates a collection of points relative to the center line of each supplied length. For example; a length of
 * 100 centered to 0 would result in the left position of -50 and a right position of +50.
 *
 * Length values should be unique, as duplicates will be trimmed from the result.
 *
 * @example
 * createGuidelinesFromLengths([100, 200, 200, -200, 201]) => [
 *  {left: -50, right: 50, length: 100},
 *  {left: -100, right: 100, length: 200},
 *  {left: 100, right: -100, length: -200},
 *  {left: -100.5, right: 100.5, length: 201},
 * ]
 * When length is 0, return  {left: 0, right: 0, length: 0}
 *
 * @param lengths A colection of length values which will be split into a left & right guides.
 * @returns A collection of LengthGuide objects which can be used to draw left & right guides
 */
export const createGuidesFromLengths = (lengths: number[]): LengthGuide[] => {
  return Array.from(new Set(lengths)).reduce<LengthGuide[]>((acc, length) => {
    const h = length * 0.5;
    if (length === 0) {
      return [...acc, { left: 0, right: 0, length }];
    }
    if (!h || !Number.isFinite(length)) {
      // Filter out nonsensical values, null, undefined, NaN, empty string
      return acc;
    }
    return [...acc, { left: -h, right: h, length }];
  }, []);
};

/**
 * This creates a Guideline configuration generating a collection of guideline pairs from each supplied length value.
 * Each length value generates a guideline config for both the left and right side of the length.
 * When length is 0, generate a guideline at position: {x: 0}
 *
 */
export const createFixedGuidelinesFromLengths = (
  lengths: number[],
  key: string = 'guide',
): { key: string; position: { x: number } }[] => {
  return createGuidesFromLengths(lengths).reduce<
    { key: string; position: { x: number } }[]
  >((acc, { left, right, length }) => {
    if (length === 0) {
      return [
        ...acc,
        {
          key: `${key}-${length}-centre`,
          position: {
            x: left,
          },
        },
      ];
    } else {
      return [
        ...acc,
        {
          key: `${key}-${length}-left`,
          position: {
            x: left,
          },
        },
        {
          key: `${key}-${length}-right`,
          position: {
            x: right,
          },
        },
      ];
    }
  }, []);
};
