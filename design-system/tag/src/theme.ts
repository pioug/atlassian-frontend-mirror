import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultBorderRadius, defaultRoundedBorderRadius } from './constants';

export const textColors = {
  standard: {
    light: token('color.text', colors.N700),
    dark: token('color.text', colors.DN600),
  },
  /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
  green: {
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.N800),
  },
  purple: {
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.N800),
  },
  red: {
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.N800),
  },
  yellow: {
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.N800),
  },
  grey: { light: colors.N0, dark: colors.N0 },
  teal: {
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.N800),
  },
  blue: {
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.N800),
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

export const backgroundColors = {
  standard: {
    light: token('color.background.neutral', colors.N20),
    dark: token('color.background.neutral', colors.DN100A),
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
    light: token('color.background.accent.blue', colors.B75),
    dark: token('color.background.accent.blue', colors.B75),
  },
  greenLight: {
    light: token('color.background.accent.green', colors.G100),
    dark: token('color.background.accent.green', colors.G100),
  },
  purpleLight: {
    light: token('color.background.accent.purple', colors.P75),
    dark: token('color.background.accent.purple', colors.P75),
  },
  redLight: {
    light: token('color.background.accent.red', colors.R75),
    dark: token('color.background.accent.red', colors.R75),
  },
  yellowLight: {
    light: token('color.background.accent.orange', colors.Y100),
    dark: token('color.background.accent.orange', colors.Y100),
  },
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  greyLight: { light: colors.N30, dark: colors.N30 },
};

export const linkHoverBackgroundColors = {
  standard: {
    light: token('color.background.neutral.hovered', colors.N30),
    dark: token('color.background.neutral.hovered', colors.DN60),
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

export const focusRingColors = {
  light: token('color.border.focused', colors.B100),
  dark: token('color.border.focused', colors.B75),
};

export const linkHoverTextColors = {
  light: token('color.link.pressed', colors.B300),
  dark: token('color.link.pressed', colors.B200),
};

export const linkActiveBackgroundColors = {
  light: token('color.background.neutral.pressed', colors.N30),
  dark: token('color.background.neutral.pressed', colors.DN600),
};

export const borderRadius = {
  default: defaultBorderRadius,
  rounded: defaultRoundedBorderRadius,
};

export const removalHoverBackgroundColors = {
  light: token('color.background.danger.hovered', colors.R50),
  dark: token('color.background.danger.hovered', colors.R100),
};

export const removalActiveBackgroundColors = {
  light: token('color.background.danger.pressed', colors.R50),
  dark: token('color.background.danger.pressed', colors.DN600),
};

export const removalTextColors = {
  light: token('color.text', colors.R500),
  dark: token('color.text', colors.DN30),
};
