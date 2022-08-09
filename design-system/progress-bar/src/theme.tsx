import { createTheme } from '@atlaskit/theme/components';

import { ThemeProps, ThemeTokens } from './types';

/**
 * Creates the default theme, which can be customised using the `theme` prop
 *
 * @deprecated
 */
export const Theme = createTheme<ThemeTokens, ThemeProps>((props) => ({
  container: {},
  bar: {},
  determinateBar: {},
  increasingBar: {},
  decreasingBar: {},
}));
