import * as colors from './colors';
import * as typography from './typography';
import getTheme from './utils/get-theme';
import themed from './utils/themed';

export { colors, typography, getTheme, themed };

export {
	CHANNEL,
	DEFAULT_THEME_MODE,
	THEME_MODES,
	assistive,
	focusRing,
	layers,
	noFocusRing,
	skeletonShimmer,
	visuallyHidden,
} from './constants';
export { default, useGlobalTheme } from './components/theme';
export { createTheme } from './utils/create-theme';
export type { ThemeProp } from './utils/create-theme';
export type {
	AtlaskitThemeProps,
	CustomThemeProps,
	DefaultValue,
	GlobalThemeTokens,
	NoThemeProps,
	Theme,
	ThemeModes,
	ThemeProps,
	ThemedValue,
} from './types';
