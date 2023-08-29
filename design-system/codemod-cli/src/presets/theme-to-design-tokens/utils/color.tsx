import { legacyColorMixins, legacyColors } from './legacy-colors';
import { namedColors } from './named-colors';

export const isLegacyColor = (value: string) => legacyColors.includes(value);

export const isLegacyNamedColor = (value: string) =>
  legacyColorMixins.includes(value);

const colorRegexp =
  /#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})\b|(?:rgb|rgba|hsl|hsla|lch|lab|color)\([^\)]*\)/;

export const includesHardCodedColor = (raw: string) => {
  const value = raw.toLowerCase();
  if (colorRegexp.exec(value)) {
    return true;
  }

  for (let i = 0; i < namedColors.length; i++) {
    if (value.includes(`${namedColors[i]};`)) {
      return true;
    }
  }

  return false;
};

export const isHardCodedColor = (raw: string) => {
  const value = raw.toLowerCase();

  if (namedColors.includes(value)) {
    return true;
  }

  const match = value.toLowerCase().match(colorRegexp);
  if (match && match[0] === value) {
    return true;
  }

  return false;
};

export function isBoldColor(color: string) {
  const number = parseInt(color.replace(/^./, ''), 10);
  return number > 300;
}
