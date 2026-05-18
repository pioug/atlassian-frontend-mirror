import { DEFAULT_THEME_NAME } from './default-theme';
import { generateTheme } from './theme-generator';
import { type NavigationTheme } from './types';

/**
 * @deprecated `@atlaskit/atlassian-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export const atlassianTheme: NavigationTheme = generateTheme({
	name: DEFAULT_THEME_NAME,
	backgroundColor: '#FFFFFF',
	highlightColor: '#0052CC',
});
