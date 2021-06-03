import chromatism from 'chromatism';

export const hexToRGBA = (hex: string, opacity: number = 1) => {
  const rgba = { ...chromatism.convert(hex).rgb, ...{ a: opacity } };

  return `rgba(${Object.values(rgba).join(', ')})`;
};

export const getBoxShadow = (color: string) => `0 0 0 2px ${color}`;

const hex = '[a-z0-9]';
const shortHandHexColorPattern = new RegExp(`#(${hex})(${hex})(${hex})`, 'i');

const repeat = (str: string, times: number) =>
  [...Array(times)].map(() => str).join('');

const isShortHexColor = (color: string) => color && color.length === 4;

const completeHexColor = (colors: string[]) => {
  const hex = colors.map((color) => repeat(color, 2)).join('');
  return `#${hex}`;
};

const completeTriplet = (colors: string[]) => `#${repeat(colors[1], 6)}`;

const isTriplet = (colors: string[]) =>
  colors[0] === colors[1] && colors[1] === colors[2];

export const convertHexShorthand = (color: string) => {
  if (isShortHexColor(color)) {
    // when color = '#ccc', matches is structured as ['#ccc', 'c', 'c', 'c', ...]
    const matches = color.match(shortHandHexColorPattern);
    if (matches) {
      const colors = matches.slice(1, 4);
      if (isTriplet(colors)) {
        return completeTriplet(colors);
      } else {
        return completeHexColor(colors);
      }
    }
  }

  // return the color as is when it's not hex color shorthand
  return color;
};

export const generateTextColor = (color: string) => {
  const converted = convertHexShorthand(color);
  return chromatism.contrastRatio(converted).hex;
};

export const getContrastColor = (
  contrastValue: number,
  opacityValue: number,
  color: string,
) => hexToRGBA(chromatism.contrast(contrastValue, color).hex, opacityValue);
