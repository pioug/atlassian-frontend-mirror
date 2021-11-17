import { CSS_PREFIX } from '../../constants';

/**
 * Transforms a style dictionary path to a CSS custom property.
 *
 * A css prefix will be preppended and all [default] key words will be omitted
 * from the path
 *
 * Example: color.background.bold.[default] => ds-background-bold
 */
export const customPropertyValue = (path: string[]) => {
  return [CSS_PREFIX, ...path.slice(1)]
    .filter((el) => el !== '[default]')
    .join('-');
};
/**
 * Transforms a style dictionary path to a CSS custom property
 *
 * All [default] key words will be omitted from the path
 *
 * Example: color.background.bold.[default] => color.background.bold
 */
export const customPropertyKey = (path: string[]) => {
  return path.filter((el) => el !== '[default]').join('.');
};
