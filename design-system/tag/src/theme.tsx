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
  lime: {
    light: token('color.text.accent.lime.bolder', '#37471F'),
    dark: token('color.text.accent.lime.bolder', '#D3F1A7'),
  },
  magenta: {
    light: token('color.text.accent.magenta.bolder', '#50253F'),
    dark: token('color.text.accent.magenta.bolder', '#FDD0EC'),
  },
  orange: {
    light: token('color.text.accent.orange.bolder', '#5F3811'),
    dark: token('color.text.accent.orange.bolder', '#FFE2BD'),
  },
  grey: {
    light: token('color.text.accent.gray.bolder', colors.N0),
    dark: token('color.text.accent.gray.bolder', colors.N0),
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
  limeLight: {
    light: token('color.text.accent.lime', '#4C6B1F'),
    dark: token('color.text.accent.lime', '#B3DF72'),
  },
  magentaLight: {
    light: token('color.text.accent.magenta', '#943D73'),
    dark: token('color.text.accent.magenta', '#F797D2'),
  },
  orangeLight: {
    light: token('color.text.accent.orange', '#974F0C'),
    dark: token('color.text.accent.orange', '#FEC57B'),
  },
  greyLight: {
    light: token('color.text.accent.gray', colors.N500),
    dark: token('color.text.accent.gray', colors.N500),
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
  lime: {
    light: token('color.text.accent.lime.bolder', '#37471F'),
    dark: token('color.text.accent.lime.bolder', '#D3F1A7'),
  },
  magenta: {
    light: token('color.text.accent.magenta.bolder', '#50253F'),
    dark: token('color.text.accent.magenta.bolder', '#FDD0EC'),
  },
  orange: {
    light: token('color.text.accent.orange.bolder', '#5F3811'),
    dark: token('color.text.accent.orange.bolder', '#FFE2BD'),
  },
  grey: {
    light: token('color.text.accent.gray.bolder', colors.N0),
    dark: token('color.text.accent.gray.bolder', colors.N0),
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
  limeLight: {
    light: token('color.text.accent.lime', '#4C6B1F'),
    dark: token('color.text.accent.lime', '#B3DF72'),
  },
  magentaLight: {
    light: token('color.text.accent.magenta', '#943D73'),
    dark: token('color.text.accent.magenta', '#F797D2'),
  },
  orangeLight: {
    light: token('color.text.accent.orange', '#974F0C'),
    dark: token('color.text.accent.orange', '#FEC57B'),
  },
  greyLight: {
    light: token('color.text.accent.gray', colors.N500),
    dark: token('color.text.accent.gray', colors.N500),
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
  lime: {
    light: token('color.text.accent.lime', '#4C6B1F'),
    dark: token('color.text.accent.lime', '#B3DF72'),
  },
  magenta: {
    light: token('color.text.accent.magenta', '#943D73'),
    dark: token('color.text.accent.magenta', '#F797D2'),
  },
  orange: {
    light: token('color.text.accent.orange', '#974F0C'),
    dark: token('color.text.accent.orange', '#FEC57B'),
  },
  grey: {
    light: token('color.text.accent.gray', colors.N0),
    dark: token('color.text.accent.gray', colors.N0),
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
  limeLight: {
    light: token('color.text.accent.lime.bolder', '#37471F'),
    dark: token('color.text.accent.lime.bolder', '#D3F1A7'),
  },
  magentaLight: {
    light: token('color.text.accent.magenta.bolder', '#50253F'),
    dark: token('color.text.accent.magenta.bolder', '#FDD0EC'),
  },
  orangeLight: {
    light: token('color.text.accent.orange.bolder', '#5F3811'),
    dark: token('color.text.accent.orange.bolder', '#FFE2BD'),
  },
  greyLight: {
    light: token('color.text.accent.gray.bolder', colors.N500),
    dark: token('color.text.accent.gray.bolder', colors.N500),
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
  lime: {
    light: token('color.background.accent.lime.subtle', '#94C748'),
    dark: token('color.background.accent.lime.subtle', '#4C6B1F'),
  },
  magenta: {
    light: token('color.background.accent.magenta.subtle', '#E774BB'),
    dark: token('color.background.accent.magenta.subtle', '#943D73'),
  },
  orange: {
    light: token('color.background.accent.orange.subtle', '#FAA53D'),
    dark: token('color.background.accent.orange.subtle', '#974F0C'),
  },
  grey: {
    light: token('color.background.accent.gray.subtle', colors.N500),
    dark: token('color.background.accent.gray.subtle', colors.N500),
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
  limeLight: {
    light: token('color.background.accent.lime.subtler', '#D3F1A7'),
    dark: token('color.background.accent.lime.subtler', '#37471F'),
  },
  magentaLight: {
    light: token('color.background.accent.magenta.subtler', '#FDD0EC'),
    dark: token('color.background.accent.magenta.subtler', '#50253F'),
  },
  orangeLight: {
    light: token('color.background.accent.orange.subtler', '#FFE2BD'),
    dark: token('color.background.accent.orange.subtler', '#5F3811'),
  },
  greyLight: {
    light: token('color.background.accent.gray.subtler', colors.N30),
    dark: token('color.background.accent.gray.subtler', colors.N30),
  },
};

export const linkHoverBackgroundColors = {
  standard: {
    light: token('color.background.neutral.hovered', colors.N30),
    dark: token('color.background.neutral.hovered', colors.DN60),
  },
  blue: {
    light: token('color.background.accent.blue.subtle.hovered', colors.B75),
    dark: token('color.background.accent.blue.subtle.hovered', colors.DN60),
  },
  red: {
    light: token('color.background.accent.red.subtle.hovered', colors.R75),
    dark: token('color.background.accent.red.subtle.hovered', colors.DN60),
  },
  yellow: {
    light: token('color.background.accent.yellow.subtle.hovered', colors.Y100),
    dark: token('color.background.accent.yellow.subtle.hovered', colors.DN60),
  },
  green: {
    light: token('color.background.accent.green.subtle.hovered', colors.G100),
    dark: token('color.background.accent.green.subtle.hovered', colors.DN60),
  },
  teal: {
    light: token('color.background.accent.teal.subtle.hovered', colors.T100),
    dark: token('color.background.accent.teal.subtle.hovered', colors.DN60),
  },
  purple: {
    light: token('color.background.accent.purple.subtle.hovered', colors.P75),
    dark: token('color.background.accent.purple.subtle.hovered', colors.DN60),
  },
  lime: {
    light: token('color.background.accent.lime.subtle.hovered', '#B3DF72'),
    dark: token('color.background.accent.lime.subtle.hovered', '#37471F'),
  },
  magenta: {
    light: token('color.background.accent.magenta.subtle.hovered', '#F797D2'),
    dark: token('color.background.accent.magenta.subtle.hovered', '#50253F'),
  },
  orange: {
    light: token('color.background.accent.orange.subtle.hovered', '#FEC57B'),
    dark: token('color.background.accent.orange.subtle.hovered', '#37471F'),
  },
  grey: {
    light: token('color.background.accent.gray.subtle.hovered', colors.N400),
    dark: token('color.background.accent.gray.subtle.hovered', colors.N500),
  },
  blueLight: {
    light: token('color.background.accent.blue.subtler.hovered', colors.B50),
    dark: token('color.background.accent.blue.subtler.hovered', colors.DN60),
  },
  redLight: {
    light: token('color.background.accent.red.subtler.hovered', colors.R50),
    dark: token('color.background.accent.red.subtler.hovered', colors.DN60),
  },
  yellowLight: {
    light: token('color.background.accent.yellow.subtler.hovered', colors.Y75),
    dark: token('color.background.accent.yellow.subtler.hovered', colors.DN60),
  },
  greenLight: {
    light: token('color.background.accent.green.subtler.hovered', colors.G75),
    dark: token('color.background.accent.green.subtler.hovered', colors.DN60),
  },
  tealLight: {
    light: token('color.background.accent.teal.subtler.hovered', colors.T75),
    dark: token('color.background.accent.teal.subtler.hovered', colors.DN60),
  },
  purpleLight: {
    light: token('color.background.accent.purple.subtler.hovered', colors.P50),
    dark: token('color.background.accent.purple.subtler.hovered', colors.DN60),
  },
  limeLight: {
    light: token('color.background.accent.lime.subtler.hovered', '#B3DF72'),
    dark: token('color.background.accent.lime.subtler.hovered', '#4C6B1F'),
  },
  magentaLight: {
    light: token('color.background.accent.magenta.subtler.hovered', '#F797D2'),
    dark: token('color.background.accent.magenta.subtler.hovered', '#943D73'),
  },
  orangeLight: {
    light: token('color.background.accent.orange.subtler.hovered', '#FEC57B'),
    dark: token('color.background.accent.orange.subtler.hovered', '#974F0C'),
  },
  greyLight: {
    light: token('color.background.accent.gray.subtler.hovered', colors.N40),
    dark: token('color.background.accent.gray.subtler.hovered', colors.DN60),
  },
};

export const linkActiveBackgroundColors = {
  standard: {
    light: token('color.background.neutral.pressed', colors.N30),
    dark: token('color.background.neutral.pressed', colors.DN600),
  },
  blue: {
    light: token('color.background.accent.blue.subtle.pressed', colors.B50),
    dark: token('color.background.accent.blue.subtle.pressed', colors.DN600),
  },
  red: {
    light: token('color.background.accent.red.subtle.pressed', colors.R50),
    dark: token('color.background.accent.red.subtle.pressed', colors.DN600),
  },
  yellow: {
    light: token('color.background.accent.yellow.subtle.pressed', colors.Y75),
    dark: token('color.background.accent.yellow.subtle.pressed', colors.DN600),
  },
  green: {
    light: token('color.background.accent.green.subtle.pressed', colors.G75),
    dark: token('color.background.accent.green.subtle.pressed', colors.DN600),
  },
  teal: {
    light: token('color.background.accent.teal.subtle.pressed', colors.T75),
    dark: token('color.background.accent.teal.subtle.pressed', colors.DN600),
  },
  purple: {
    light: token('color.background.accent.purple.subtle.pressed', colors.P50),
    dark: token('color.background.accent.purple.subtle.pressed', colors.DN600),
  },
  grey: {
    light: token('color.background.accent.gray.subtle.pressed', colors.N300),
    dark: token('color.background.accent.gray.subtle.pressed', colors.DN600),
  },
  lime: {
    light: token('color.background.accent.lime.subtle.pressed', '#D3F1A7'),
    dark: token('color.background.accent.lime.subtle.pressed', '#2A3818'),
  },
  magenta: {
    light: token('color.background.accent.magenta.subtle.pressed', '#FDD0EC'),
    dark: token('color.background.accent.magenta.subtle.pressed', '#421F34'),
  },
  orange: {
    light: token('color.background.accent.orange.subtle.pressed', '#FFE2BD'),
    dark: token('color.background.accent.orange.subtle.pressed', '#4A2B0F'),
  },
  blueLight: {
    light: token('color.background.accent.blue.subtler.pressed', colors.B100),
    dark: token('color.background.accent.blue.subtler.pressed', colors.DN600),
  },
  redLight: {
    light: token('color.background.accent.red.subtler.pressed', colors.R100),
    dark: token('color.background.accent.red.subtler.pressed', colors.DN600),
  },
  yellowLight: {
    light: token('color.background.accent.yellow.subtler.pressed', colors.Y200),
    dark: token('color.background.accent.yellow.subtler.pressed', colors.DN600),
  },
  greenLight: {
    light: token('color.background.accent.green.subtler.pressed', colors.G200),
    dark: token('color.background.accent.green.subtler.pressed', colors.DN600),
  },
  tealLight: {
    light: token('color.background.accent.teal.subtler.pressed', colors.T200),
    dark: token('color.background.accent.teal.subtler.pressed', colors.DN600),
  },
  purpleLight: {
    light: token('color.background.accent.purple.subtler.pressed', colors.P100),
    dark: token('color.background.accent.purple.subtler.pressed', colors.DN600),
  },
  limeLight: {
    light: token('color.background.accent.lime.subtler.pressed', '#94C748'),
    dark: token('color.background.accent.lime.subtler.pressed', '#5B7F24'),
  },
  magentaLight: {
    light: token('color.background.accent.magenta.subtler.pressed', '#E774BB'),
    dark: token('color.background.accent.magenta.subtler.pressed', '#AE4787'),
  },
  orangeLight: {
    light: token('color.background.accent.orange.subtler.pressed', '#FAA53D'),
    dark: token('color.background.accent.orange.subtler.pressed', '#B65C02'),
  },
  greyLight: {
    light: token('color.background.accent.gray.subtler.pressed', colors.N50),
    dark: token('color.background.accent.gray.subtler.pressed', colors.DN600),
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
 */
export const removeButtonColors = {
  standard: token('color.text', colors.N500),
  blue: token('color.text.accent.blue.bolder', colors.N500),
  red: token('color.text.accent.red.bolder', colors.N500),
  yellow: token('color.text.accent.yellow.bolder', colors.N500),
  green: token('color.text.accent.green.bolder', colors.N500),
  teal: token('color.text.accent.teal.bolder', colors.N500),
  purple: token('color.text.accent.purple.bolder', colors.N500),
  lime: token('color.text.accent.lime.bolder', colors.N500),
  magenta: token('color.text.accent.magenta.bolder', colors.N500),
  orange: token('color.text.accent.orange.bolder', colors.N500),
  grey: token('color.text.accent.gray.bolder', colors.N500),
  blueLight: token('color.text.accent.blue', colors.N500),
  redLight: token('color.text.accent.red', colors.N500),
  yellowLight: token('color.text.accent.yellow', colors.N500),
  greenLight: token('color.text.accent.green', colors.N500),
  tealLight: token('color.text.accent.teal', colors.N500),
  purpleLight: token('color.text.accent.purple', colors.N500),
  limeLight: token('color.text.accent.lime', colors.N500),
  magentaLight: token('color.text.accent.magenta', colors.N500),
  orangeLight: token('color.text.accent.orange', colors.N500),
  greyLight: token('color.text.accent.gray', colors.N500),
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
  lime: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  magenta: {
    light: token('color.text.danger', colors.N800),
    dark: token('color.text.danger', colors.N800),
  },
  orange: {
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
  limeLight: {
    light: token('color.text.danger', colors.P500),
    dark: token('color.text.danger', colors.P500),
  },
  magentaLight: {
    light: token('color.text.danger', colors.P500),
    dark: token('color.text.danger', colors.P500),
  },
  orangeLight: {
    light: token('color.text.danger', colors.P500),
    dark: token('color.text.danger', colors.P500),
  },
  greyLight: {
    light: token('color.text.danger', colors.N500),
    dark: token('color.text.danger', colors.N500),
  },
};
