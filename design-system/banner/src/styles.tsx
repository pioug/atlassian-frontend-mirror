import { DN40, N0, N500, N700, R300, R400, Y300 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

export const TRANSITION_DURATION = '0.25s ease-in-out';

export const getBackgroundColor = themed('appearance', {
  error: { light: R400, dark: R300 },
  warning: { light: Y300, dark: Y300 },
  announcement: { light: N500, dark: N500 },
});

export const getTextColor = themed('appearance', {
  error: { light: N0, dark: DN40 },
  warning: { light: N700, dark: DN40 },
  announcement: { light: N0, dark: N0 },
});

export const testErrorBackgroundColor = R400;
export const testErrorTextColor = N0;
