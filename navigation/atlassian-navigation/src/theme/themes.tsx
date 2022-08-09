import { B400, N0 } from '@atlaskit/theme/colors';

import { DEFAULT_THEME_NAME } from './default-theme';
import { generateTheme } from './theme-generator';
import { NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
  name: DEFAULT_THEME_NAME,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: N0,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  highlightColor: B400,
});

export const defaultTheme: NavigationTheme = atlassianTheme;
