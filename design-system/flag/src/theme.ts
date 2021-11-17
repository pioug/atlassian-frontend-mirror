import {
  B100,
  B400,
  DN40,
  DN50,
  DN600,
  G300,
  G400,
  N0,
  N200,
  N30A,
  N40,
  N500,
  N50A,
  N60A,
  N700,
  R300,
  R400,
  Y200,
  Y300,
} from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { AppearanceTypes } from './types';

const flagBackgroundColor = {
  error: {
    light: token('color.background.overlay', R400),
    dark: token('color.background.overlay', R300),
  },
  info: {
    light: token('color.background.overlay', N500),
    dark: token('color.background.overlay', N500),
  },
  normal: {
    light: token('color.background.overlay', N0),
    dark: token('color.background.overlay', DN50),
  },
  success: {
    light: token('color.background.overlay', G400),
    dark: token('color.background.overlay', G300),
  },
  warning: {
    light: token('color.background.overlay', Y200),
    dark: token('color.background.overlay', Y300),
  },
};

export const getFlagBackgroundColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagBackgroundColor[appearance][mode];

export const flagBorderColor = token('color.background.overlay', N60A);

const flagIconColor = {
  error: {
    light: token('color.iconBorder.danger', N0),
    dark: token('color.iconBorder.danger', DN40),
  },
  info: {
    light: token('color.iconBorder.discovery', N0),
    dark: token('color.iconBorder.discovery', DN600),
  },
  normal: {
    light: token('color.iconBorder.brand', N500),
    dark: token('color.iconBorder.brand', DN600),
  },
  success: {
    light: token('color.iconBorder.success', N0),
    dark: token('color.iconBorder.success', DN40),
  },
  warning: {
    light: token('color.iconBorder.warning', N700),
    dark: token('color.iconBorder.warning', DN40),
  },
};

const flagTextColor = {
  error: {
    light: token('color.text.highEmphasis', N0),
    dark: token('color.text.highEmphasis', DN40),
  },
  info: {
    light: token('color.text.highEmphasis', N0),
    dark: token('color.text.highEmphasis', DN600),
  },
  normal: {
    light: token('color.text.highEmphasis', N500),
    dark: token('color.text.highEmphasis', DN600),
  },
  success: {
    light: token('color.text.highEmphasis', N0),
    dark: token('color.text.highEmphasis', DN40),
  },
  warning: {
    light: token('color.text.highEmphasis', N700),
    dark: token('color.text.highEmphasis', DN40),
  },
};

export const getFlagTextColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagTextColor[appearance][mode];

export const getFlagIconColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagIconColor[appearance][mode];

// token set in flag.tsx instead
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const flagShadowColor = N50A;

const flagFocusRingColor = {
  error: {
    light: token('color.border.focus', N40),
    dark: token('color.border.focus', N40),
  },
  info: {
    light: token('color.border.focus', N40),
    dark: token('color.border.focus', N40),
  },
  normal: {
    light: token('color.border.focus', B100),
    dark: token('color.border.focus', B100),
  },
  success: {
    light: token('color.border.focus', N40),
    dark: token('color.border.focus', N40),
  },
  warning: {
    light: token('color.border.focus', N200),
    dark: token('color.border.focus', N200),
  },
};

export const getFlagFocusRingColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagFocusRingColor[appearance][mode];

const lightButtonBackground = 'rgba(255, 255, 255, 0.08)';

const actionBackground = {
  success: {
    light: token(
      'color.background.subtleNeutral.resting',
      lightButtonBackground,
    ),
    dark: token('color.background.subtleNeutral.resting', N30A),
  },
  info: {
    light: token(
      'color.background.subtleNeutral.resting',
      lightButtonBackground,
    ),
    dark: token(
      'color.background.subtleNeutral.resting',
      lightButtonBackground,
    ),
  },
  error: {
    light: token(
      'color.background.subtleNeutral.resting',
      lightButtonBackground,
    ),
    dark: token('color.background.subtleNeutral.resting', N30A),
  },
  warning: {
    light: token('color.background.subtleNeutral.resting', N30A),
    dark: token('color.background.subtleNeutral.resting', N30A),
  },
  normal: {
    light: token('color.background.subtleNeutral.resting', 'none'),
    dark: token('color.background.subtleNeutral.resting', 'none'),
  },
};

const actionColor = {
  success: {
    light: token('color.text.mediumEmphasis', N0),
    dark: token('color.text.mediumEmphasis', DN40),
  },
  info: {
    light: token('color.text.mediumEmphasis', N0),
    dark: token('color.text.mediumEmphasis', DN600),
  },
  error: {
    light: token('color.text.mediumEmphasis', N0),
    dark: token('color.text.mediumEmphasis', DN600),
  },
  warning: {
    light: token('color.text.mediumEmphasis', N700),
    dark: token('color.text.mediumEmphasis', DN40),
  },
  normal: {
    light: token('color.text.mediumEmphasis', B400),
    dark: token('color.text.mediumEmphasis', B100),
  },
};

export const getActionBackground = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => actionBackground[appearance][mode];

export const getActionColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => actionColor[appearance][mode];
