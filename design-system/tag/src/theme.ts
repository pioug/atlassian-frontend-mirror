import * as colors from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

import { ChromeColors, ChromeLinkColors, TagColor } from './types';

const textColors = {
  standard: { light: colors.N700, dark: colors.DN600 },
  green: { light: colors.N800, dark: colors.N800 },
  purple: { light: colors.N800, dark: colors.N800 },
  red: { light: colors.N800, dark: colors.N800 },
  yellow: { light: colors.N800, dark: colors.N800 },
  grey: { light: colors.N0, dark: colors.N0 },
  teal: { light: colors.N800, dark: colors.N800 },
  blue: { light: colors.N800, dark: colors.N800 },
  tealLight: { light: colors.N500, dark: colors.N500 },
  blueLight: { light: colors.B500, dark: colors.B500 },
  greenLight: { light: colors.G500, dark: colors.G500 },
  purpleLight: { light: colors.P500, dark: colors.P500 },
  redLight: { light: colors.N500, dark: colors.N500 },
  yellowLight: { light: colors.N500, dark: colors.N500 },
  greyLight: { light: colors.N500, dark: colors.N500 },
};

const backgroundColors = {
  standard: { light: colors.N20, dark: colors.DN100A },
  green: { light: colors.G200, dark: colors.G200 },
  purple: { light: colors.P100, dark: colors.P100 },
  red: { light: colors.R100, dark: colors.R100 },
  yellow: { light: colors.Y200, dark: colors.Y200 },
  grey: { light: colors.N500, dark: colors.N500 },
  teal: { light: colors.T200, dark: colors.T200 },
  blue: { light: colors.B100, dark: colors.B100 },
  tealLight: { light: colors.T100, dark: colors.T100 },
  blueLight: { light: colors.B75, dark: colors.B75 },
  greenLight: { light: colors.G100, dark: colors.G100 },
  purpleLight: { light: colors.P75, dark: colors.P75 },
  redLight: { light: colors.R75, dark: colors.R75 },
  yellowLight: { light: colors.Y100, dark: colors.Y100 },
  greyLight: { light: colors.N30, dark: colors.N30 },
};

const focusRingColorObj = { light: colors.B100, dark: colors.B75 };
const hoverBoxShadowColorObj = { light: colors.R300, dark: colors.R200 };
const focusBoxShadowColorObj = { light: colors.B100, dark: colors.B75 };
const linkTextColorObj = { light: colors.B300, dark: colors.B200 };

const textColorsForRemoval = {
  ...textColors,
  standard: { light: colors.R500, dark: colors.DN30 },
};

const backgroundColorsRemoval = {
  ...backgroundColors,
  standard: { light: colors.R50, dark: colors.R100 },
};

const getTextColor = (tagColor: TagColor, mode: ThemeModes): string => {
  const color = tagColor ? tagColor : 'standard';
  return textColors[color][mode];
};

const getLinkTextColorHover = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  if (tagColor !== 'standard') {
    return 'inherit';
  }

  return linkTextColorObj[mode];
};

const getBackgroundColor = (tagColor: TagColor, mode: ThemeModes): string => {
  const color = tagColor ? tagColor : 'standard';
  return backgroundColors[color][mode];
};

const getTextColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  const color = tagColor ? tagColor : 'standard';
  return textColorsForRemoval[color][mode];
};

const getBackgroundColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  const color = tagColor ? tagColor : 'standard';
  return backgroundColorsRemoval[color][mode];
};

const getChromeColors = (color: TagColor, mode: ThemeModes): ChromeColors => {
  const backgroundColor = getBackgroundColor(color, mode);
  const backgroundColorHover = getBackgroundColorForRemoval(color, mode);

  const textColor = getTextColor(color, mode);
  const textColorHover = getTextColorForRemoval(color, mode);

  return {
    backgroundColor,
    backgroundColorHover,
    textColor,
    textColorHover,
  };
};

const getChromeLinkColors = (
  color: TagColor,
  mode: ThemeModes,
): ChromeLinkColors => {
  const hoverBackgroundColorRemoval = getBackgroundColorForRemoval(color, mode);
  const hoverTextColorRemoval = getTextColorForRemoval(color, mode);
  const focusRingColor = focusRingColorObj[mode];

  return {
    hoverBackgroundColorRemoval,
    hoverTextColorRemoval,
    focusRingColor,
  };
};

const getButtonColors = (color: TagColor, mode: ThemeModes) => {
  const backgroundColor = getBackgroundColor(color, mode);
  const backgroundColorHover = getBackgroundColorForRemoval(color, mode);

  const focusBoxShadowColor = focusBoxShadowColorObj[mode];
  const hoverBoxShadowColor = hoverBoxShadowColorObj[mode];

  return {
    backgroundColor,
    backgroundColorHover,
    focusBoxShadowColor,
    hoverBoxShadowColor,
  };
};

export const getThemeColors = (color: TagColor, mode: ThemeModes) => {
  const chromeColors = getChromeColors(color, mode);
  const chromeLinkColors = getChromeLinkColors(color, mode);
  const buttonColors = getButtonColors(color, mode);
  const linkHoverColor = getLinkTextColorHover(color, mode);

  return {
    chromeColors,
    chromeLinkColors,
    buttonColors,
    linkHoverColor,
  };
};
