import * as colors from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { ChromeColors, ChromeLinkColors, TagColor } from './types';

const textColors = {
  standard: {
    light: token('color.text.highEmphasis', colors.N700),
    dark: token('color.text.highEmphasis', colors.DN600),
  },
  /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
  green: {
    light: token('color.text.highEmphasis', colors.N800),
    dark: token('color.text.highEmphasis', colors.N800),
  },
  purple: {
    light: token('color.text.highEmphasis', colors.N800),
    dark: token('color.text.highEmphasis', colors.N800),
  },
  red: {
    light: token('color.text.highEmphasis', colors.N800),
    dark: token('color.text.highEmphasis', colors.N800),
  },
  yellow: {
    light: token('color.text.highEmphasis', colors.N800),
    dark: token('color.text.highEmphasis', colors.N800),
  },
  grey: { light: colors.N0, dark: colors.N0 },
  teal: {
    light: token('color.text.highEmphasis', colors.N800),
    dark: token('color.text.highEmphasis', colors.N800),
  },
  blue: {
    light: token('color.text.highEmphasis', colors.N800),
    dark: token('color.text.highEmphasis', colors.N800),
  },
  tealLight: { light: colors.N500, dark: colors.N500 },
  /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
  blueLight: {
    light: token('color.text.brand', colors.B500),
    dark: token('color.text.brand', colors.B500),
  },
  greenLight: {
    light: token('color.text.success', colors.G500),
    dark: token('color.text.success', colors.G500),
  },
  purpleLight: {
    light: token('color.text.discovery', colors.P500),
    dark: token('color.text.discovery', colors.P500),
  },
  redLight: {
    light: token('color.text.danger', colors.N500),
    dark: token('color.text.danger', colors.N500),
  },
  yellowLight: {
    light: token('color.text.warning', colors.N500),
    dark: token('color.text.warning', colors.N500),
  },
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  greyLight: { light: colors.N500, dark: colors.N500 },
};

const backgroundColors = {
  standard: {
    light: token('color.background.subtleNeutral.resting', colors.N20),
    dark: token('color.background.subtleNeutral.resting', colors.DN100A),
  },
  /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
  green: { light: colors.G200, dark: colors.G200 },
  purple: { light: colors.P100, dark: colors.P100 },
  red: { light: colors.R100, dark: colors.R100 },
  yellow: { light: colors.Y200, dark: colors.Y200 },
  grey: { light: colors.N500, dark: colors.N500 },
  teal: { light: colors.T200, dark: colors.T200 },
  blue: { light: colors.B100, dark: colors.B100 },
  tealLight: { light: colors.T100, dark: colors.T100 },
  /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
  blueLight: {
    light: token('color.accent.subtleBlue', colors.B75),
    dark: token('color.accent.subtleBlue', colors.B75),
  },
  greenLight: {
    light: token('color.accent.subtleGreen', colors.G100),
    dark: token('color.accent.subtleGreen', colors.G100),
  },
  purpleLight: {
    light: token('color.accent.subtlePurple', colors.P75),
    dark: token('color.accent.subtlePurple', colors.P75),
  },
  redLight: {
    light: token('color.accent.subtleRed', colors.R75),
    dark: token('color.accent.subtleRed', colors.R75),
  },
  yellowLight: {
    light: token('color.accent.subtleOrange', colors.Y100),
    dark: token('color.accent.subtleOrange', colors.Y100),
  },
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  greyLight: { light: colors.N30, dark: colors.N30 },
};

const linkBackgroundColorHover = {
  standard: {
    light: token('color.background.subtleNeutral.hover', colors.N30),
    dark: token('color.background.subtleNeutral.hover', colors.DN60),
  },
  /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
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
  /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
};

const focusRingColorObj = {
  light: token('color.border.focus', colors.B100),
  dark: token('color.border.focus', colors.B75),
};

const focusBoxShadowColorObj = {
  light: token('color.border.focus', colors.B100),
  dark: token('color.border.focus', colors.B75),
};

const linkHoverColorObj = {
  light: token('color.text.link.pressed', colors.B300),
  dark: token('color.text.link.pressed', colors.B200),
};

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

const getActiveBackgroundColor = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  return {
    light: token('color.background.subtleNeutral.pressed', colors.N30),
    dark: token('color.background.subtleNeutral.pressed', colors.DN600),
  }[mode];
};

const getActiveBackgroundColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  return {
    light: token('color.background.subtleDanger.pressed', colors.R50),
    dark: token('color.background.subtleDanger.pressed', colors.DN600),
  }[mode];
};

const getTextColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  return {
    light: token('color.text.highEmphasis', colors.R500),
    dark: token('color.text.highEmphasis', colors.DN30),
  }[mode];
};

const getBackgroundColorForRemoval = (
  tagColor: TagColor,
  mode: ThemeModes,
): string => {
  return {
    light: token('color.background.subtleDanger.hover', colors.R50),
    dark: token('color.background.subtleDanger.hover', colors.R100),
  }[mode];
};

const getChromeColors = (
  color: TagColor,
  mode: ThemeModes,
  isRemovable?: boolean,
): ChromeColors => {
  const activeBackgroundColor = getActiveBackgroundColorForRemoval(color, mode);
  const backgroundColor = getBackgroundColor(color, mode);
  const backgroundColorHover = isRemovable
    ? getBackgroundColorForRemoval(color, mode)
    : getLinkBackgroundColorHover(color, mode);
  const textColor = getTextColor(color, mode);
  const textColorHover = isRemovable
    ? getTextColorForRemoval(color, mode)
    : getTextColor(color, mode);

  return {
    activeBackgroundColor,
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
  const activeBackgroundColor = getActiveBackgroundColor(color, mode);
  const activeBackgroundColorRemoval = getActiveBackgroundColorForRemoval(
    color,
    mode,
  );
  const hoverBackgroundColorRemoval = getBackgroundColorForRemoval(color, mode);
  const hoverBackgroundColor = getLinkBackgroundColorHover(color, mode);
  const hoverTextColor = linkHoverColorObj[mode];
  const focusRingColor = focusRingColorObj[mode];

  return {
    activeBackgroundColor,
    activeBackgroundColorRemoval,
    hoverBackgroundColor,
    hoverTextColor,
    hoverBackgroundColorRemoval,
    focusRingColor,
  };
};

const getButtonColors = (color: TagColor, mode: ThemeModes) => {
  const backgroundColor = getBackgroundColor(color, mode);
  const backgroundColorHover = getBackgroundColorForRemoval(color, mode);

  const focusBoxShadowColor = focusBoxShadowColorObj[mode];

  return {
    backgroundColor,
    backgroundColorHover,
    focusBoxShadowColor,
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
