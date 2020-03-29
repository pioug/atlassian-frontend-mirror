import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';

const textColors = themed('color', {
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
});

const backgroundColors = themed('color', {
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
});

export const textColor = textColors;
export const backgroundColor = backgroundColors;

export const textColorHover = themed('color', {
  standard: { light: colors.N700, dark: colors.B75 },
  green: { light: colors.B400, dark: colors.B100 },
  purple: { light: colors.B400, dark: colors.B100 },
  red: { light: colors.B400, dark: colors.B100 },
  yellow: { light: colors.B400, dark: colors.B100 },
  grey: { light: colors.B400, dark: colors.B100 },
  teal: { light: colors.B400, dark: colors.B100 },
  blue: { light: colors.B400, dark: colors.B100 },
  tealLight: { light: colors.B400, dark: colors.B100 },
  blueLight: { light: colors.B400, dark: colors.B100 },
  greenLight: { light: colors.B400, dark: colors.B100 },
  purpleLight: { light: colors.B400, dark: colors.B100 },
  redLight: { light: colors.B400, dark: colors.B100 },
  yellowLight: { light: colors.B400, dark: colors.B100 },
  greyLight: { light: colors.B400, dark: colors.B100 },
});

export const backgroundColorHover = themed('color', {
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
});
