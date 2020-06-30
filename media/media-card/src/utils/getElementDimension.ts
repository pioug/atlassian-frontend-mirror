export type ElementDimension = 'height' | 'width';

export const getElementDimension = (
  element: Element,
  dimension: ElementDimension,
): number => {
  const dimensionValue = element.getBoundingClientRect()[dimension];
  return Math.round(dimensionValue);
};
