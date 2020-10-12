import { B400, N0 } from '@atlaskit/theme/colors';

import { DEFAULT_THEME_NAME } from './defaultTheme';
import { generateTheme } from './themeGenerator';
import { NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
  name: DEFAULT_THEME_NAME,
  backgroundColor: N0,
  highlightColor: B400,
});

export const defaultTheme: NavigationTheme = atlassianTheme;
