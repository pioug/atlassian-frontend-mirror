import { CSS_PREFIX } from '../../constants';

/**
 * Transforms a style dictionary path to a CSS custom property.
 */
export const customPropertyValue = (path: string[]) => {
  return [CSS_PREFIX, ...path.slice(1)].join('-');
};
