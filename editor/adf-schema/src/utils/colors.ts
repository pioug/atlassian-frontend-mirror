import * as namedColors from 'css-color-names'; // eslint-disable-line import/extensions

/**
 * We're avoding importing these colors from @atlaskit/theme since we
 * do not want to have react as a dependency of this package.
 * TODO: Refactor this once tokenization by Core team is ready
 * https://product-fabric.atlassian.net/browse/CS-908
 */

export const R50 = '#FFEBE6';
export const R75 = '#FFBDAD';
export const R100 = '#FF8F73';
export const R300 = '#FF5630';
export const R400 = '#DE350B';
export const R500 = '#BF2600';

export const Y50 = '#FFFAE6';
export const Y75 = '#FFF0B3';
export const Y200 = '#FFC400';
export const Y400 = '#FF991F';
export const Y500 = '#FF8B00';

export const G50 = '#E3FCEF';
export const G75 = '#ABF5D1';
export const G200 = '#57D9A3';
export const G300 = '#36B37E';
export const G400 = '#00875A';
export const G500 = '#006644';

export const B50 = '#DEEBFF';
export const B75 = '#B3D4FF';
export const B100 = '#4C9AFF';
export const B400 = '#0052CC';
export const B500 = '#0747A6';

export const N0 = '#FFFFFF';
export const N20 = '#F4F5F7';
export const N30 = '#EBECF0';
export const N40 = '#DFE1E6';
export const N50 = '#C1C7D0';
export const N60 = '#B3BAC5';
export const N80 = '#97A0AF';
export const N90 = '#8993A4';
export const N200 = '#6B778C';
export const N300 = '#5E6C84';
export const N500 = '#42526E';
export const N800 = '#172B4D';

export const P50 = '#EAE6FF';
export const P75 = '#C0B6F2';
export const P100 = '#998DD9';
export const P300 = '#6554C0';
export const P400 = '#5243AA';
export const P500 = '#403294';

export const T50 = '#E6FCFF';
export const T75 = '#B3F5FF';
export const T100 = '#79E2F2';
export const T300 = '#00B8D9';
export const T500 = '#008DA6';

/**
 * @return String with HEX-coded color
 */
export function normalizeHexColor(
  color: string | null,
  defaultColor?: string,
): string | null {
  if (!color) {
    return null;
  }

  // Normalize to hex
  color = color.trim().toLowerCase();
  if (isHex(color)) {
    // Normalize 3-hex to 6-hex colours
    if (color.length === 4) {
      color = color
        .split('')
        .map(c => (c === '#' ? '#' : `${c}${c}`))
        .join('');
    }
  } else if (isRgb(color)) {
    return rgbToHex(color);
  } else {
    // http://dev.w3.org/csswg/css-color/#named-colors
    if (namedColors.default && (namedColors as any).default[color]) {
      color = (namedColors as any).default[color];
    } else if (namedColors && namedColors[color]) {
      color = namedColors[color];
    } else {
      return null;
    }
  }

  if (color === defaultColor) {
    return null;
  }

  return color;
}

/**
 * Converts hex color format to rgb.
 * Works well with full hex color format and shortcut as well.
 *
 * @param hex - hex color string (#xxx, or #xxxxxx)
 */
export function hexToRgb(color: string): string | null {
  if (!isHex(color)) {
    return null;
  }

  let colorBits = color.substring(1).split('');
  if (colorBits.length === 3) {
    colorBits = [
      colorBits[0],
      colorBits[0],
      colorBits[1],
      colorBits[1],
      colorBits[2],
      colorBits[2],
    ];
  }

  const rgb = Number(`0x${colorBits.join('')}`);
  // eslint-disable-next-line no-bitwise
  return `rgb(${(rgb >> 16) & 255},${(rgb >> 8) & 255},${rgb & 255})`;
}

/**
 * Converts hex color format to rgba.
 *
 * @param hex - hex color string (#xxx, or #xxxxxx)
 */
export function hexToRgba(rawColor: string, alpha: number) {
  let color = normalizeHexColor(rawColor);
  if (!color) {
    return null;
  }
  const hex2rgb = (color: string) =>
    color.match(/[a-z0-9]{2}/gi)!.map(hex => parseInt(hex, 16));
  return `rgba(${hex2rgb(color)
    .concat(alpha)
    .join(',')})`;
}

export function rgbToHex(value: string): string | null {
  const matches = value.match(/(0?\.?\d{1,3})%?\b/g);

  if (matches && matches.length >= 3) {
    const [red, green, blue] = matches.map(Number);
    return (
      '#' +
      (blue | (green << 8) | (red << 16) | (1 << 24)).toString(16).slice(1) // eslint-disable-line no-bitwise
    );
  }

  return null;
}

export function isRgb(color: string): boolean {
  return /rgba?\(/.test(color);
}

export function isHex(color: string): boolean {
  return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
}
