import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const themedBackground = {
  light: token('color.background.default', '#FFFFFF'),
  dark: token('color.background.default', '#1B2638'),
} as const;

/**
 * Returns the background color depending on the passed through mode.
 * @param mode
 */
export const getBackground = (mode: ThemeModes = 'light') =>
  themedBackground[mode];
