import * as colors from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

import { AppearanceTypes } from './types';

const flagBackgroundColor = {
  error: { light: colors.R400, dark: colors.R300 },
  info: { light: colors.N500, dark: colors.N500 },
  normal: { light: colors.N0, dark: colors.DN50 },
  success: { light: colors.G400, dark: colors.G300 },
  warning: { light: colors.Y200, dark: colors.Y300 },
};

export const getFlagBackgroundColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagBackgroundColor[appearance][mode];

export const flagBorderColor = colors.N60A;

const flagTextColor = {
  error: { light: colors.N0, dark: colors.DN40 },
  info: { light: colors.N0, dark: colors.DN600 },
  normal: { light: colors.N500, dark: colors.DN600 },
  success: { light: colors.N0, dark: colors.DN40 },
  warning: { light: colors.N700, dark: colors.DN40 },
};

export const getFlagTextColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagTextColor[appearance][mode];

export const flagShadowColor = colors.N50A;

const flagFocusRingColor = {
  error: { light: colors.N40, dark: colors.N40 },
  info: { light: colors.N40, dark: colors.N40 },
  normal: { light: colors.B100, dark: colors.B100 },
  success: { light: colors.N40, dark: colors.N40 },
  warning: { light: colors.N200, dark: colors.N200 },
};

export const getFlagFocusRingColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagFocusRingColor[appearance][mode];

const lightButtonBackground = 'rgba(255, 255, 255, 0.08)';

const actionBackground = {
  success: { light: lightButtonBackground, dark: colors.N30A },
  info: { light: lightButtonBackground, dark: lightButtonBackground },
  error: { light: lightButtonBackground, dark: colors.N30A },
  warning: { light: colors.N30A, dark: colors.N30A },
  normal: { light: 'none', dark: 'none' },
};

const actionColor = {
  success: { light: colors.N0, dark: colors.DN40 },
  info: { light: colors.N0, dark: colors.DN600 },
  error: { light: colors.N0, dark: colors.DN600 },
  warning: { light: colors.N700, dark: colors.DN40 },
  normal: { light: colors.B400, dark: colors.B100 },
};

export const getActionBackground = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => actionBackground[appearance][mode];

export const getActionColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => actionColor[appearance][mode];
