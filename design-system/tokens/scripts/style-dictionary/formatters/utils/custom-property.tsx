/**
 * Transforms a style dictionarty path to a CSS custom property.
 */
export const customPropertyValue = (path: string[]) => {
  return path.slice(1).join('-');
};
