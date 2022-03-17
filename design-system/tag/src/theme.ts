/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultBorderRadius, defaultRoundedBorderRadius } from './constants';

// Text colors
export const textColors = {
  standard: {
    light: token('color.text', colors.N700),
    dark: token('color.text', colors.DN600),
  },
  standardLink: {
    light: token('color.link', colors.B400),
    dark: token('color.link', colors.B400),
  },
  blue: {
    light: token('color.text.accent.blue.bolder', colors.N800),
    dark: token('color.text.accent.blue.bolder', colors.N800),
  },
  red: {
    light: token('color.text.accent.red.bolder', colors.N800),
    dark: token('color.text.accent.red.bolder', colors.N800),
  },
  yellow: {
    light: token('color.text.accent.yellow.bolder', colors.N800),
    dark: token('color.text.accent.yellow.bolder', colors.N800),
  },
  green: {
    light: token('color.text.accent.green.bolder', colors.N800),
    dark: token('color.text.accent.green.bolder', colors.N800),
  },
  teal: {
    light: token('color.text.accent.teal.bolder', colors.N800),
    dark: token('color.text.accent.teal.bolder', colors.N800),
  },
  purple: {
    light: token('color.text.accent.purple.bolder', colors.N800),
    dark: token('color.text.accent.purple.bolder', colors.N800),
  },
  grey: {
    light: token('color.text.inverse', colors.N0),
    dark: token('color.text.inverse', colors.N0),
  },
  blueLight: {
    light: token('color.text.accent.blue', colors.B500),
    dark: token('color.text.accent.blue', colors.B500),
  },
  redLight: {
    light: token('color.text.accent.red', colors.N500),
    dark: token('color.text.accent.red', colors.N500),
  },
  yellowLight: {
    light: token('color.text.accent.yellow', colors.N500),
    dark: token('color.text.accent.yellow', colors.N500),
  },
  greenLight: {
    light: token('color.text.accent.green', colors.G500),
    dark: token('color.text.accent.green', colors.G500),
  },
  tealLight: {
    light: token('color.text.accent.teal', colors.N500),
    dark: token('color.text.accent.teal', colors.N500),
  },
  purpleLight: {
    light: token('color.text.accent.purple', colors.P500),
    dark: token('color.text.accent.purple', colors.P500),
  },
  greyLight: {
    light: token('color.text', colors.N500),
    dark: token('color.text', colors.N500),
  },
};

/**
 * With design tokens, hover colors do not change
 * compared to resting state. These are only here
 * for backwards compatibiltiy with legacy theming.
 * This can be removed when legacy theming is removed
 */
export const textHoverColors = {
  standard: {
    light: token('color.link', colors.B300),
    dark: token('color.link', colors.B200),
  },
  blue: {
    light: token('color.text.accent.blue.bolder', colors.N800),
    dark: token('color.text.accent.blue.bolder', colors.N800),
  },
  red: {
    light: token('color.text.accent.red.bolder', colors.N800),
    dark: token('color.text.accent.red.bolder', colors.N800),
  },
  yellow: {
    light: token('color.text.accent.yellow.bolder', colors.N800),
    dark: token('color.text.accent.yellow.bolder', colors.N800),
  },
  green: {
    light: token('color.text.accent.green.bolder', colors.N800),
    dark: token('color.text.accent.green.bolder', colors.N800),
  },
  teal: {
    light: token('color.text.accent.teal.bolder', colors.N800),
    dark: token('color.text.accent.teal.bolder', colors.N800),
  },
  purple: {
    light: token('color.text.accent.purple.bolder', colors.N800),
    dark: token('color.text.accent.purple.bolder', colors.N800),
  },
  grey: {
    light: token('color.text.inverse', colors.N0),
    dark: token('color.text.inverse', colors.N0),
  },
  blueLight: {
    light: token('color.text.accent.blue', colors.B500),
    dark: token('color.text.accent.blue', colors.B500),
  },
  redLight: {
    light: token('color.text.accent.red', colors.N500),
    dark: token('color.text.accent.red', colors.N500),
  },
  yellowLight: {
    light: token('color.text.accent.yellow', colors.N500),
    dark: token('color.text.accent.yellow', colors.N500),
  },
  greenLight: {
    light: token('color.text.accent.green', colors.G500),
    dark: token('color.text.accent.green', colors.G500),
  },
  tealLight: {
    light: token('color.text.accent.teal', colors.N500),
    dark: token('color.text.accent.teal', colors.N500),
  },
  purpleLight: {
    light: token('color.text.accent.purple', colors.P500),
    dark: token('color.text.accent.purple', colors.P500),
  },
  greyLight: {
    light: token('color.text', colors.N500),
    dark: token('color.text', colors.N500),
  },
};

export const textActiveColors = {
  standard: {
    light: token('color.link.pressed', colors.B300),
    dark: token('color.link.pressed', colors.B300),
  },
  blue: {
    light: token('color.text.accent.blue', colors.N800),
    dark: token('color.text.accent.blue', colors.N800),
  },
  red: {
    light: token('color.text.accent.red', colors.N800),
    dark: token('color.text.accent.red', colors.N800),
  },
  yellow: {
    light: token('color.text.accent.yellow', colors.N800),
    dark: token('color.text.accent.yellow', colors.N800),
  },
  green: {
    light: token('color.text.accent.green', colors.N800),
    dark: token('color.text.accent.green', colors.N800),
  },
  teal: {
    light: token('color.text.accent.teal', colors.N800),
    dark: token('color.text.accent.teal', colors.N800),
  },
  purple: {
    light: token('color.text.accent.purple', colors.N800),
    dark: token('color.text.accent.purple', colors.N800),
  },
  grey: {
    light: token('color.text.inverse', colors.N0),
    dark: token('color.text.inverse', colors.N0),
  },
  blueLight: {
    light: token('color.text.accent.blue.bolder', colors.B500),
    dark: token('color.text.accent.blue.bolder', colors.B500),
  },
  redLight: {
    light: token('color.text.accent.red.bolder', colors.N500),
    dark: token('color.text.accent.red.bolder', colors.N500),
  },
  yellowLight: {
    light: token('color.text.accent.yellow.bolder', colors.N500),
    dark: token('color.text.accent.yellow.bolder', colors.N500),
  },
  greenLight: {
    light: token('color.text.accent.green.bolder', colors.G500),
    dark: token('color.text.accent.green.bolder', colors.G500),
  },
  tealLight: {
    light: token('color.text.accent.teal.bolder', colors.N500),
    dark: token('color.text.accent.teal.bolder', colors.N500),
  },
  purpleLight: {
    light: token('color.text.accent.purple.bolder', colors.P500),
    dark: token('color.text.accent.purple.bolder', colors.P500),
  },
  greyLight: {
    light: token('color.text', colors.N500),
    dark: token('color.text', colors.N500),
  },
};

// Background colors
export const backgroundColors = {
  standard: {
    light: token('color.background.neutral', colors.N20),
    dark: token('color.background.neutral', colors.DN100A),
  },
  blue: {
    light: token('color.background.accent.blue.subtle', colors.B100),
    dark: token('color.background.accent.blue.subtle', colors.B100),
  },
  red: {
    light: token('color.background.accent.red.subtle', colors.R100),
    dark: token('color.background.accent.red.subtle', colors.R100),
  },
  yellow: {
    light: token('color.background.accent.yellow.subtle', colors.Y200),
    dark: token('color.background.accent.yellow.subtle', colors.Y200),
  },
  green: {
    light: token('color.background.accent.green.subtle', colors.G200),
    dark: token('color.background.accent.green.subtle', colors.G200),
  },
  teal: {
    light: token('color.background.accent.teal.subtle', colors.T200),
    dark: token('color.background.accent.teal.subtle', colors.T200),
  },
  purple: {
    light: token('color.background.accent.purple.subtle', colors.P100),
    dark: token('color.background.accent.purple.subtle', colors.P100),
  },
  grey: {
    light: token('color.background.neutral.bold', colors.N500),
    dark: token('color.background.neutral.bold', colors.N500),
  },
  blueLight: {
    light: token('color.background.accent.blue.subtler', colors.B75),
    dark: token('color.background.accent.blue.subtler', colors.B75),
  },
  redLight: {
    light: token('color.background.accent.red.subtler', colors.R75),
    dark: token('color.background.accent.red.subtler', colors.R75),
  },
  yellowLight: {
    light: token('color.background.accent.orange.subtler', colors.Y100),
    dark: token('color.background.accent.orange.subtler', colors.Y100),
  },
  greenLight: {
    light: token('color.background.accent.green.subtler', colors.G100),
    dark: token('color.background.accent.green.subtler', colors.G100),
  },
  tealLight: {
    light: token('color.background.accent.teal.subtler', colors.T100),
    dark: token('color.background.accent.teal.subtler', colors.T100),
  },
  purpleLight: {
    light: token('color.background.accent.purple.subtler', colors.P75),
    dark: token('color.background.accent.purple.subtler', colors.P75),
  },
  greyLight: {
    light: token('color.background.neutral', colors.N30),
    dark: token('color.background.neutral', colors.N30),
  },
};

export const linkHoverBackgroundColors = {
  standard: {
    light: token('color.background.neutral.hovered', colors.N30),
    dark: token('color.background.neutral.hovered', colors.DN60),
  },
  blue: {
    light: token('color.background.accent.blue.subtler', colors.B75),
    dark: token('color.background.accent.blue.subtler', colors.DN60),
  },
  red: {
    light: token('color.background.accent.red.subtler', colors.R75),
    dark: token('color.background.accent.red.subtler', colors.DN60),
  },
  yellow: {
    light: token('color.background.accent.yellow.subtler', colors.Y100),
    dark: token('color.background.accent.yellow.subtler', colors.DN60),
  },
  green: {
    light: token('color.background.accent.green.subtler', colors.G100),
    dark: token('color.background.accent.green.subtler', colors.DN60),
  },
  teal: {
    light: token('color.background.accent.teal.subtler', colors.T100),
    dark: token('color.background.accent.teal.subtler', colors.DN60),
  },
  purple: {
    light: token('color.background.accent.purple.subtler', colors.P75),
    dark: token('color.background.accent.purple.subtler', colors.DN60),
  },
  grey: {
    light: token('color.background.neutral.bold.hovered', colors.N400),
    dark: token('color.background.neutral.bold.hovered', colors.N500),
  },
  blueLight: {
    light: token('color.background.accent.blue.subtlest', colors.B50),
    dark: token('color.background.accent.blue.subtlest', colors.DN60),
  },
  redLight: {
    light: token('color.background.accent.red.subtlest', colors.R50),
    dark: token('color.background.accent.red.subtlest', colors.DN60),
  },
  yellowLight: {
    light: token('color.background.accent.yellow.subtlest', colors.Y75),
    dark: token('color.background.accent.yellow.subtlest', colors.DN60),
  },
  greenLight: {
    light: token('color.background.accent.green.subtlest', colors.G75),
    dark: token('color.background.accent.green.subtlest', colors.DN60),
  },
  tealLight: {
    light: token('color.background.accent.teal.subtlest', colors.T75),
    dark: token('color.background.accent.teal.subtlest', colors.DN60),
  },
  purpleLight: {
    light: token('color.background.accent.purple.subtlest', colors.P50),
    dark: token('color.background.accent.purple.subtlest', colors.DN60),
  },
  greyLight: {
    light: token('color.background.neutral.hovered', colors.N40),
    dark: token('color.background.neutral.hovered', colors.DN60),
  },
};

export const linkActiveBackgroundColors = {
  standard: {
    light: token('color.background.neutral.pressed', colors.N30),
    dark: token('color.background.neutral.pressed', colors.DN600),
  },
  blue: {
    light: token('color.background.accent.blue.subtlest', colors.B50),
    dark: token('color.background.accent.blue.subtlest', colors.DN600),
  },
  red: {
    light: token('color.background.accent.red.subtlest', colors.R50),
    dark: token('color.background.accent.red.subtlest', colors.DN600),
  },
  yellow: {
    light: token('color.background.accent.yellow.subtlest', colors.Y75),
    dark: token('color.background.accent.yellow.subtlest', colors.DN600),
  },
  green: {
    light: token('color.background.accent.green.subtlest', colors.G75),
    dark: token('color.background.accent.green.subtlest', colors.DN600),
  },
  teal: {
    light: token('color.background.accent.teal.subtlest', colors.T75),
    dark: token('color.background.accent.teal.subtlest', colors.DN600),
  },
  purple: {
    light: token('color.background.accent.purple.subtlest', colors.P50),
    dark: token('color.background.accent.purple.subtlest', colors.DN600),
  },
  grey: {
    light: token('color.background.neutral.bold.pressed', colors.N300),
    dark: token('color.background.neutral.bold.pressed', colors.DN600),
  },
  blueLight: {
    light: token('color.background.accent.blue.subtle', colors.B100),
    dark: token('color.background.accent.blue.subtle', colors.DN600),
  },
  redLight: {
    light: token('color.background.accent.red.subtle', colors.R100),
    dark: token('color.background.accent.red.subtle', colors.DN600),
  },
  yellowLight: {
    light: token('color.background.accent.yellow.subtle', colors.Y200),
    dark: token('color.background.accent.yellow.subtle', colors.DN600),
  },
  greenLight: {
    light: token('color.background.accent.green.subtle', colors.G200),
    dark: token('color.background.accent.green.subtle', colors.DN600),
  },
  tealLight: {
    light: token('color.background.accent.teal.subtle', colors.T200),
    dark: token('color.background.accent.teal.subtle', colors.DN600),
  },
  purpleLight: {
    light: token('color.background.accent.purple.subtle', colors.P100),
    dark: token('color.background.accent.purple.subtle', colors.DN600),
  },
  greyLight: {
    light: token('color.background.neutral.pressed', colors.N50),
    dark: token('color.background.neutral.pressed', colors.DN600),
  },
};

export const focusRingColors = {
  light: token('color.border.focused', colors.B100),
  dark: token('color.border.focused', colors.B75),
};

export const borderRadius = {
  default: defaultBorderRadius,
  rounded: defaultRoundedBorderRadius,
};

export const removalHoverBackgroundColors = {
  light: token('color.background.danger', colors.R50),
  dark: token('color.background.danger', colors.R100),
};

export const removalActiveBackgroundColors = {
  light: token('color.background.danger.hovered', colors.R50),
  dark: token('color.background.danger.hovered', colors.DN600),
};

export const removalTextColors = {
  light: token('color.text.danger', colors.R500),
  dark: token('color.text.danger', colors.DN30),
};

/**
 * Remove button colors
 *
 * Once legacy theming support is dropped,
 * these can be removed and the remove button can inherit
 * from the tag text color
 **/
export const removeButtonColors = {
  standard: token('color.text', colors.N500),
  blue: token('color.text.accent.blue.bolder', colors.N500),
  red: token('color.text.accent.red.bolder', colors.N500),
  yellow: token('color.text.accent.yellow.bolder', colors.N500),
  green: token('color.text.accent.green.bolder', colors.N500),
  teal: token('color.text.accent.teal.bolder', colors.N500),
  purple: token('color.text.accent.purple.bolder', colors.N500),
  grey: token('color.text.inverse', colors.N500),
  blueLight: token('color.text.accent.blue', colors.N500),
  redLight: token('color.text.accent.red', colors.N500),
  yellowLight: token('color.text.accent.yellow', colors.N500),
  greenLight: token('color.text.accent.green', colors.N500),
  tealLight: token('color.text.accent.teal', colors.N500),
  purpleLight: token('color.text.accent.purple', colors.N500),
  greyLight: token('color.text', colors.N500),
};

export const removeButtonHoverColors = {
  standard: {
    light: token('color.text.danger', colors.N700),
    dark: token('color.text.danger', colors.DN600),
  },
  standardLink: {
    light: token('color.text.danger', colors.B400),
    dark: token('color.text.danger', colors.B400),
  },
  blue: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  red: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  yellow: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  green: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  teal: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  purple: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  grey: {
    light: token('color.text.danger', colors.N0),
    dark: token('color.text.danger', colors.N0),
  },
  blueLight: {
    light: token('color.text.danger', colors.B500),
    dark: token('color.text.danger', colors.B500),
  },
  redLight: {
    light: token('color.text.danger', colors.N500),
    dark: token('color.text.danger', colors.N500),
  },
  yellowLight: {
    light: token('color.text.danger', colors.N500),
    dark: token('color.text.danger', colors.N500),
  },
  greenLight: {
    light: token('color.text.danger', colors.G500),
    dark: token('color.text.danger', colors.G500),
  },
  tealLight: {
    light: token('color.text.danger', colors.N500),
    dark: token('color.text.danger', colors.N500),
  },
  purpleLight: {
    light: token('color.text.danger', colors.P500),
    dark: token('color.text.danger', colors.P500),
  },
  greyLight: {
    light: token('color.text.danger', colors.N500),
    dark: token('color.text.danger', colors.N500),
  },
};
