import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const themedBackground = {
  light: token('elevation.surface', '#FFFFFF'),
  dark: token('elevation.surface', '#1B2638'),
} as const;

/**
 * Returns the background color depending on the passed through mode.
 * @param mode
 */
export const getBackground = (mode: ThemeModes = 'light') =>
  themedBackground[mode];
