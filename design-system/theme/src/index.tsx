import getTheme from './utils/get-theme';

export { getTheme };

export { default } from './components/theme';
export {
	assistive,
	CHANNEL,
	DEFAULT_THEME_MODE,
	focusRing,
	layers,
	noFocusRing,
	THEME_MODES,
	visuallyHidden,
} from './constants';
export type {
	AtlaskitThemeProps,
	CustomThemeProps,
	DefaultValue,
	GlobalThemeTokens,
	NoThemeProps,
	Theme,
	ThemedValue,
	ThemeModes,
	ThemeProps,
} from './types';
export { createTheme } from './utils/create-theme';
export type { ThemeProp } from './utils/create-theme';
