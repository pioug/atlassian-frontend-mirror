import { CSS_PREFIX } from '../constants';

/**
 * Transforms a style dictionary token path to a CSS custom property.
 *
 * A css prefix will be preppended and all [default] key words will be omitted
 * from the path
 *
 * Example: color.background.bold.[default] => ds-background-bold
 */
export const getCSSCustomPropertyId = (path: string[]) =>
  [CSS_PREFIX, ...path.slice(1)].filter((el) => el !== '[default]').join('-');

/**
 * Transforms a style dictionary token path to a shorthand token id
 * These ids will be typically be how tokens are interacted with via typescript and css
 *
 * All [default] key words will be omitted from the path
 *
 * Example: color.background.bold.[default] => color.background.bold
 */
export const getTokenId = (path: string[]) =>
  path.filter((el) => el !== '[default]').join('.');

/**
 * Transforms a style dictionary token path to a fully qualified token id
 * These Ids are intended to be used internal to this package by style-dictionary
 *
 * [default] key words will NOT be omitted from the path
 *
 * Example: color.background.bold.[default] => color.background.bold.[default]
 */
export const getFullyQualifiedTokenId = (path: string[]) => path.join('.');
