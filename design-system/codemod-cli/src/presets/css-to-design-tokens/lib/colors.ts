import { knownNamedColors, knownVariables } from './legacy-colors';

const NAMED_COLORS = Object.keys(knownNamedColors);
const GRADIENT_TYPES = ['linear', 'radial', 'conic'] as const;
const LESS_COLOR_FUNCTIONS = [
  'lighten',
  'darken',
  'saturate',
  'desaturate',
  'fadein',
  'fadeout',
  'fade',
  'spin',
  'mix',
  'greyscale',
  'contrast',
  'multiply',
  'screen',
  'overlay',
  'softlight',
  'hardlight',
  'difference',
  'exclusion',
  'average',
  'negation',
  'tint',
  'shade',
  'luma',
  'hue',
  'saturation',
  'lightness',
  'alpha',
  'red',
  'green',
  'blue',
];

const REGEXES = {
  // The CSS regular expression matches CSS variable declarations.
  // It looks for the string "var(" followed by any characters except a closing parenthesis, and ending with a closing parenthesis.
  CSS: /var\([^\)]+\)/g,
  // The RAW_COLOR regular expression matches various CSS color formats including hexadecimal, RGB(A), HSL(A), LAB, LCH, and HWB.
  // It allows for optional leading and trailing white spaces.
  // For RGBA and HSLA, it allows any number (including negative numbers and numbers greater than 1) for the alpha channel.
  // For RGB, HSL, LAB, LCH, and HWB, it expects three comma-separated values.
  // It also allows optional white spaces around the commas and the values.
  RAW_COLOR:
    /^\s*(#([0-9a-f]{3}){1,2}|(rgba|hsla)\(\s*\d{1,3}%?\s*(,\s*\d{1,3}%?\s*){2},\s*-?\d*\.?\d+\s*\)|(rgb|hsl)\(\s*\d{1,3}%?\s*(,\s*\d{1,3}%?\s*){2}\)\s*|(lab|lch)\(\s*\d{1,3}%?\s+\d{1,3}%?\s+\d{1,3}%?\s*\)|hwb\(\s*\d{1,3}\s+\d{1,3}%?\s+\d{1,3}%?\s*\))\s*$/i,
};

export function isKnownCssVariable(value: string) {
  return value in knownVariables;
}
export function isRawColor(value: string) {
  return REGEXES.RAW_COLOR.test(value);
}
export function isNamedColor(value: string) {
  return NAMED_COLORS.includes(value);
}
export function isGradient(value: string) {
  return GRADIENT_TYPES.some((gradient) =>
    value.startsWith(`${gradient}-gradient(`),
  );
}
export function extractBetweenParentheses(value: string) {
  const match = value.match(/\((.*?)\)/);
  return match ? match[1] : '';
}
export function isLessFunction(value: string) {
  return LESS_COLOR_FUNCTIONS.some((func) => value.startsWith(`${func}(`));
}
