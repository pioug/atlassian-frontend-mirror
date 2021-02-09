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

const linkBackgroundColorHover = {
  standard: { light: colors.N30, dark: colors.DN60 },
  green: { light: colors.G100, dark: colors.DN60 },
  purple: { light: colors.P75, dark: colors.DN60 },
  red: { light: colors.R75, dark: colors.DN60 },
  yellow: { light: colors.Y100, dark: colors.DN60 },
  grey: { light: colors.N50, dark: colors.DN60 },
  teal: { light: colors.T100, dark: colors.DN60 },
  blue: { light: colors.B75, dark: colors.DN60 },
  tealLight: { light: colors.T75, dark: colors.DN60 },
  blueLight: { light: colors.B50, dark: colors.DN60 },
  greenLight: { light: colors.G75, dark: colors.DN60 },
  purpleLight: { light: colors.P50, dark: colors.DN60 },
  redLight: { light: colors.R50, dark: colors.DN60 },
  yellowLight: { light: colors.Y75, dark: colors.DN60 },
  greyLight: { light: colors.N30, dark: colors.DN60 },
};

const focusRingColorObj = { light: colors.B100, dark: colors.B75 };
const hoverBoxShadowColorObj = { light: colors.R300, dark: colors.R200 };
const focusBoxShadowColorObj = { light: colors.B100, dark: colors.B75 };
const linkHoverColorObj = { light: colors.B300, dark: colors.B200 };

const getTextColor = (tagColor: TagColor, mode: ThemeModes): string => {
  const color = tagColor ? tagColor : 'standard';
  return textColors[color][mode];
};

const getLinkBackgroundColorHover = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  const color = tagColor ? tagColor : 'standard';
  return linkBackgroundColorHover[color][mode];
};

const getBackgroundColor = (tagColor: TagColor, mode: ThemeModes): string => {
  const color = tagColor ? tagColor : 'standard';
  return backgroundColors[color][mode];
};

const getTextColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  return { light: colors.R500, dark: colors.DN30 }[mode];
};

const getBackgroundColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  return { light: colors.R50, dark: colors.R100 }[mode];
};

const getChromeColors = (
  color: TagColor,
  mode: ThemeModes,
  isRemovable?: boolean,
): ChromeColors => {
  const backgroundColor = getBackgroundColor(color, mode);
  const backgroundColorHover = isRemovable
    ? getBackgroundColorForRemoval(color, mode)
    : getLinkBackgroundColorHover(color, mode);

  const textColor = getTextColor(color, mode);
  const textColorHover = isRemovable
    ? getTextColorForRemoval(color, mode)
    : getTextColor(color, mode);

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

  const hoverBackgroundColor = getLinkBackgroundColorHover(color, mode);
  const hoverTextColor = linkHoverColorObj[mode];

  const focusRingColor = focusRingColorObj[mode];

  return {
    hoverBackgroundColor,
    hoverTextColor,
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

export const getThemeColors = (
  color: TagColor,
  mode: ThemeModes,
  isRemovable?: boolean,
) => {
  const chromeColors = getChromeColors(color, mode, isRemovable);
  const chromeLinkColors = getChromeLinkColors(color, mode);
  const buttonColors = getButtonColors(color, mode);
  const linkHoverColor = linkHoverColorObj[mode];

  return {
    chromeColors,
    chromeLinkColors,
    buttonColors,
    linkHoverColor,
  };
};
