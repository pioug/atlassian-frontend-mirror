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
    light: token('elevation.surface.overlay', R400),
    dark: token('elevation.surface.overlay', R300),
  },
  info: {
    light: token('elevation.surface.overlay', N500),
    dark: token('elevation.surface.overlay', N500),
  },
  normal: {
    light: token('elevation.surface.overlay', N0),
    dark: token('elevation.surface.overlay', DN50),
  },
  success: {
    light: token('elevation.surface.overlay', G400),
    dark: token('elevation.surface.overlay', G300),
  },
  warning: {
    light: token('elevation.surface.overlay', Y200),
    dark: token('elevation.surface.overlay', Y300),
  },
};

export const getFlagBackgroundColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagBackgroundColor[appearance][mode];

export const flagBorderColor = token('elevation.surface.overlay', N60A);

const flagIconColor = {
  error: {
    light: token('color.icon.danger', N0),
    dark: token('color.icon.danger', DN40),
  },
  info: {
    light: token('color.icon.discovery', N0),
    dark: token('color.icon.discovery', DN600),
  },
  normal: {
    light: token('color.icon.brand', N500),
    dark: token('color.icon.brand', DN600),
  },
  success: {
    light: token('color.icon.success', N0),
    dark: token('color.icon.success', DN40),
  },
  warning: {
    light: token('color.icon.warning', N700),
    dark: token('color.icon.warning', DN40),
  },
};

const flagTextColor = {
  error: {
    light: token('color.text', N0),
    dark: token('color.text', DN40),
  },
  info: {
    light: token('color.text', N0),
    dark: token('color.text', DN600),
  },
  normal: {
    light: token('color.text', N500),
    dark: token('color.text', DN600),
  },
  success: {
    light: token('color.text', N0),
    dark: token('color.text', DN40),
  },
  warning: {
    light: token('color.text', N700),
    dark: token('color.text', DN40),
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
    light: token('color.border.focused', N40),
    dark: token('color.border.focused', N40),
  },
  info: {
    light: token('color.border.focused', N40),
    dark: token('color.border.focused', N40),
  },
  normal: {
    light: token('color.border.focused', B100),
    dark: token('color.border.focused', B100),
  },
  success: {
    light: token('color.border.focused', N40),
    dark: token('color.border.focused', N40),
  },
  warning: {
    light: token('color.border.focused', N200),
    dark: token('color.border.focused', N200),
  },
};

export const getFlagFocusRingColor = (
  appearance: AppearanceTypes,
  mode: ThemeModes,
): string => flagFocusRingColor[appearance][mode];

const lightButtonBackground = 'rgba(255, 255, 255, 0.08)';

const actionBackground = {
  success: {
    light: token('color.background.neutral', lightButtonBackground),
    dark: token('color.background.neutral', N30A),
  },
  info: {
    light: token('color.background.neutral', lightButtonBackground),
    dark: token('color.background.neutral', lightButtonBackground),
  },
  error: {
    light: token('color.background.neutral', lightButtonBackground),
    dark: token('color.background.neutral', N30A),
  },
  warning: {
    light: token('color.background.neutral', N30A),
    dark: token('color.background.neutral', N30A),
  },
  normal: {
    light: token('color.background.neutral', 'none'),
    dark: token('color.background.neutral', 'none'),
  },
};

const actionColor = {
  success: {
    light: token('color.text.subtle', N0),
    dark: token('color.text.subtle', DN40),
  },
  info: {
    light: token('color.text.subtle', N0),
    dark: token('color.text.subtle', DN600),
  },
  error: {
    light: token('color.text.subtle', N0),
    dark: token('color.text.subtle', DN600),
  },
  warning: {
    light: token('color.text.subtle', N700),
    dark: token('color.text.subtle', DN40),
  },
  normal: {
    light: token('color.text.subtle', B400),
    dark: token('color.text.subtle', B100),
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
