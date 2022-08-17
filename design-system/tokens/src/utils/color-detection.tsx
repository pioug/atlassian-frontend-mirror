import { token } from '../index';
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

export const hexToRGBA = (hex: string) => {
  const { r, g, b, a } = hexToRGBAValues(hex);

  return `rgb${a ? 'a' : ''}(${r},${g},${b}${a ? `,${a}` : ''})`;
};

export const getLuminance = ({
  r,
  g,
  b,
}: {
  r: number;
  b: number;
  g: number;
}) => (r * 299 + g * 587 + b * 114) / 1000;

/**
 * Returns an accessible hard-coded text color based on the color contrast with
 * the background.
 *
 * @param hex - The Hex color code of the background
 * @param [opts.hardcodedSurface] - If set, a design token will be returned instead
 * of a hard-coded color. This is to support more transparent backgrounds
 * to allow the text to invert colors depending on the current theme's surface color.
 */
export const getTextColorForBackground = (
  hex: string,
  opts?: { hardcodedSurface?: 'light' | 'dark' },
): string => {
  const { r, g, b, a } = hexToRGBAValues(hex);
  const lum = getLuminance({ r, g, b });
  const alphaLimit = 0.42;

  const alphaConditionsPerSurface: {
    light: boolean;
    dark: boolean;
  } = {
    light: a < alphaLimit,
    dark: a > alphaLimit,
  };

  const alphaLimitExceeded =
    opts?.hardcodedSurface && alphaConditionsPerSurface[opts.hardcodedSurface];

  if (!opts?.hardcodedSurface && a < alphaLimit) {
    // This color is transparent, so the text will mainly cast onto the surface behind.
    // Needs to use tokens otherwise Dark mode would cause black text on black surface
    return token('color.text', 'black');
  }

  return (lum > 150 && !a) || (a && alphaLimitExceeded) ? 'black' : 'white';
};

/**
 * Returns a border if determined to be required based on the color contrast with
 * the background.
 *
 * @param hex - The Hex color code of the background
 */
export const getBorderForBackground = (hex: string) => {
  const { r, g, b, a } = hexToRGBAValues(hex);
  const lum = getLuminance({ r, g, b });

  return lum > 240 || a < 0.2
    ? `1px solid ${token('color.border', '#091E4224')}`
    : undefined;
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
