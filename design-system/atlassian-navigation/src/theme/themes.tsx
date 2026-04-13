import { DEFAULT_THEME_NAME } from './default-theme';
import { generateTheme } from './theme-generator';
import { type NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
	name: DEFAULT_THEME_NAME,
	backgroundColor: '#FFFFFF',
	highlightColor: '#0052CC',
});

export const defaultTheme: NavigationTheme = atlassianTheme;
