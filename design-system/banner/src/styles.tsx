import { DN40, N0, N500, N700, R300, R400, Y300 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export const TRANSITION_DURATION = '0.25s ease-in-out';

export const getBackgroundColor = themed('appearance', {
  error: {
    light: token('color.background.danger.bold', R400),
    dark: token('color.background.danger.bold', R300),
  },
  warning: {
    light: token('color.background.warning.bold', Y300),
    dark: token('color.background.warning.bold', Y300),
  },
  announcement: {
    light: token('color.background.neutral.bold', N500),
    dark: token('color.background.neutral.bold', N500),
  },
});

export const getTextColor = themed('appearance', {
  error: {
    light: token('color.text.inverse', N0),
    dark: token('color.text.inverse', DN40),
  },
  warning: {
    light: token('color.text.warning.inverse', N700),
    dark: token('color.text.warning.inverse', DN40),
  },
  announcement: {
    light: token('color.text.inverse', N0),
    dark: token('color.text.inverse', N0),
  },
});
