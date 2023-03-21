import { ShadowToken } from '../types';

export const hexToRGBAValues = (hex: string) => {
  const hexColor = hex.replace('#', '');

  return {
    r: parseInt(hexColor.slice(0, 2), 16),
    g: parseInt(hexColor.slice(2, 4), 16),
    b: parseInt(hexColor.slice(4, 6), 16),
    a: parseFloat((parseInt(hexColor.slice(6, 8), 16) / 255).toFixed(2)),
  };
};

/**
 * Returns a box shadow formatted for CSS from a ShadowToken raw value.
 *
 * @param rawShadow - ShadowToken raw value
 */
export const getBoxShadow = (rawShadow: ShadowToken<string>['value']) =>
  rawShadow
    .map(({ radius, offset, color, opacity }) => {
      const { r, g, b } = hexToRGBAValues(color);

      return `${offset.x}px ${offset.y}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`;
    })
    .join(',');
