import { CSS_PREFIX, CSS_VAR_FULL } from '../constants';

/**
 * Transforms a style dictionary token path to a CSS custom property.
 *
 * A css prefix will be prepended and all [default] key words will be omitted
 * from the path
 *
 * @example <caption>Passing a path as an array</caption>
 * // Returns ds-background-bold
 * getCSSCustomProperty(['color', 'background', 'bold', '[default]'])
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns ds-background-bold
 * getCSSCustomProperty('color.background.bold.[default]')
 */
export const getCSSCustomProperty = (path: string | string[]): string => {
  const normalizedPath = typeof path === 'string' ? path.split('.') : path;

  // Opacity and other 'shallow' groups are more readable when not trimmed
  const slice = CSS_VAR_FULL.includes(path[0]) ? 0 : 1;

  return `--${[CSS_PREFIX, ...normalizedPath.slice(slice)]
    .filter((el) => el !== '[default]')
    .join('-')}`;
};

/**
 * Transforms a style dictionary token path to a shorthand token id
 * These ids will be typically be how tokens are interacted with via typescript and css
 *
 * All [default] key words will be omitted from the path
 *
 * @example <caption>Passing a path as an array</caption>
 * // Returns color.background.bold
 * getTokenId(['color', 'background', 'bold', '[default]'])
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns color.background.bold
 * getTokenId('color.background.bold.[default]')
 */
export const getTokenId = (path: string | string[]): string => {
  const normalizedPath = typeof path === 'string' ? path.split('.') : path;

  return normalizedPath.filter((el) => el !== '[default]').join('.');
};

/**
 * Transforms a style dictionary token path to a fully qualified token id
 * These Ids are intended to be used internal to this package by style-dictionary
 *
 * [default] key words will NOT be omitted from the path
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns color.background.bold.[default]
 * getFullyQualifiedTokenId(['color', 'background', 'bold', '[default]'])
 */
export const getFullyQualifiedTokenId = (path: string[]): string =>
  path.join('.');
