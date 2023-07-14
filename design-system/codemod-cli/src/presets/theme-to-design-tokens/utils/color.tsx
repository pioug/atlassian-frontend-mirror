import { legacyColorMixins, legacyColors } from './legacy-colors';
import { namedColors } from './named-colors';

export const isLegacyColor = (value: string) => legacyColors.includes(value);

export const isLegacyNamedColor = (value: string) =>
  legacyColorMixins.includes(value);

export const includesHardCodedColor = (raw: string) => {
  const value = raw.toLowerCase();
  if (
    /#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})\b|(?:rgb|hsl)a?\([^\)]*\)/.exec(
      value.toLowerCase(),
    )
  ) {
    return true;
  }

  for (let i = 0; i < namedColors.length; i++) {
    if (value.includes(`${namedColors[i]};`)) {
      return true;
    }
  }

  return false;
};

export const isHardCodedColor = (value: string) => {
  if (namedColors.includes(value.toLowerCase())) {
    return true;
  }

  if (
    value.startsWith('rgb(') ||
    value.startsWith('rgba(') ||
    value.startsWith('hsl(') ||
    value.startsWith('hsla(') ||
    value.startsWith('lch(') ||
    value.startsWith('lab(') ||
    value.startsWith('color(')
  ) {
    return true;
  }

  if (
    value.startsWith('#') &&
    // short hex, hex, or hex with alpha
    (value.length === 4 || value.length === 7 || value.length === 9)
  ) {
    return true;
  }

  return false;
};
