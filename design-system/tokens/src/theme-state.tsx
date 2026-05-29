import type { ThemeColorModes } from './theme-color-modes';
import type { ThemeContrastModes, ThemeOptionsSchema } from './theme-config';
import type { ThemeIds } from './theme-ids';

/**
 * ThemeState: the standard representation of an app's current theme and preferences
 */
export interface ThemeState {
	light: Extract<
		ThemeIds,
		| 'light'
		| 'light-future'
		| 'dark'
		| 'dark-future'
		| 'light-increased-contrast'
		| 'dark-increased-contrast'
	>;
	dark: Extract<
		ThemeIds,
		| 'light'
		| 'light-future'
		| 'dark'
		| 'dark-future'
		| 'light-increased-contrast'
		| 'dark-increased-contrast'
	>;
	colorMode: ThemeColorModes;
	contrastMode: ThemeContrastModes;
	shape?: Extract<ThemeIds, 'shape'>;
	spacing: Extract<ThemeIds, 'spacing'>;
	typography: Extract<ThemeIds, 'typography'>;
	motion?: Extract<ThemeIds, 'motion'>;
	UNSAFE_themeOptions?: ThemeOptionsSchema;
}
