import { DN40, N0, N500, N700, R300, R400, Y300 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export const TRANSITION_DURATION = '0.25s ease-in-out';

export const getBackgroundColor = themed('appearance', {
  error: {
    light: token('color.background.boldDanger.resting', R400),
    dark: token('color.background.boldDanger.resting', R300),
  },
  warning: {
    light: token('color.background.boldWarning.resting', Y300),
    dark: token('color.background.boldWarning.resting', Y300),
  },
  announcement: {
    light: token('color.background.boldNeutral.resting', N500),
    dark: token('color.background.boldNeutral.resting', N500),
  },
});

export const getTextColor = themed('appearance', {
  error: {
    light: token('color.text.onBold', N0),
    dark: token('color.text.onBold', DN40),
  },
  warning: {
    light: token('color.text.onBoldWarning', N700),
    dark: token('color.text.onBoldWarning', DN40),
  },
  announcement: {
    light: token('color.text.onBold', N0),
    dark: token('color.text.onBold', N0),
  },
});
