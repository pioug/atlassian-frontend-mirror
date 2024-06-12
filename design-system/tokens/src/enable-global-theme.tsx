import { type UnbindFn } from 'bind-event-listener';

import { type ThemeIdsWithOverrides, type ThemeState, themeStateDefaults } from './theme-config';
import configurePage from './utils/configure-page';
import { getThemePreferences } from './utils/get-theme-preferences';

/**
 * Synchronously sets the theme globally at runtime. Themes are not loaded;
 * use `getThemeStyles` and other server-side utilities to generate and load them.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.shape The shape theme to be applied.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 * @param {function} themeLoader Callback function used to override the default theme loading functionality.
 *
 * @returns An unbind function, that can be used to stop listening for changes to system theme.
 *
 * @example
 * ```
 * enableGlobalTheme({colorMode: 'auto', light: 'light', dark: 'dark', spacing: 'spacing'});
 * ```
 */
const enableGlobalTheme = (
	{
		colorMode = themeStateDefaults['colorMode'],
		contrastMode = themeStateDefaults['contrastMode'],
		dark = themeStateDefaults['dark'],
		light = themeStateDefaults['light'],
		shape = themeStateDefaults['shape'],
		spacing = themeStateDefaults['spacing'],
		typography = themeStateDefaults['typography'],
		UNSAFE_themeOptions = themeStateDefaults['UNSAFE_themeOptions'],
	}: Partial<ThemeState> = {},
	themeLoader?: (id: ThemeIdsWithOverrides) => void,
): UnbindFn => {
	const themeState = {
		colorMode,
		contrastMode,
		dark,
		light,
		shape,
		spacing,
		typography,
		UNSAFE_themeOptions: themeLoader ? undefined : UNSAFE_themeOptions,
	};

	// Determine what to load and call theme loader
	const themePreferences = getThemePreferences(themeState);
	if (themeLoader) {
		themePreferences.map((themeId) => themeLoader(themeId));
	}

	const autoUnbind = configurePage(themeState);
	return autoUnbind;
};

export default enableGlobalTheme;
