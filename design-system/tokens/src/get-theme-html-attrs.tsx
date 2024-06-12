import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
	COLOR_MODE_ATTRIBUTE,
	CONTRAST_MODE_ATTRIBUTE,
	CUSTOM_THEME_ATTRIBUTE,
	THEME_DATA_ATTRIBUTE,
} from './constants';
import {
	type DataColorModes,
	type DataContrastModes,
	type ThemeState,
	themeStateDefaults,
} from './theme-config';
import { themeObjectToString } from './theme-state-transformer';
import { isValidBrandHex } from './utils/color-utils';
import { hash } from './utils/hash';

const defaultColorMode: DataColorModes = 'light';
const defaultContrastMode: DataContrastModes = 'no-preference';

/**
 * Server-side rendering utility. Generates the valid HTML attributes for a given theme.
 * Note: this utility does not handle automatic theme switching.
 *
 * @param {Object<string, string>} themeOptions - Theme options object
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @returns {Object} Object of HTML attributes to be applied to the document root
 */
const getThemeHtmlAttrs = ({
	colorMode = themeStateDefaults['colorMode'],
	dark = themeStateDefaults['dark'],
	light = themeStateDefaults['light'],
	contrastMode = themeStateDefaults['contrastMode'],
	shape = themeStateDefaults['shape'],
	spacing = themeStateDefaults['spacing'],
	typography = themeStateDefaults['typography'],
	UNSAFE_themeOptions = themeStateDefaults['UNSAFE_themeOptions'],
}: Partial<ThemeState> = {}): Record<string, string> => {
	const themeAttribute = themeObjectToString({
		dark,
		light,
		shape,
		spacing,
		typography,
	});

	let result: Record<string, string> = {
		[THEME_DATA_ATTRIBUTE]: themeAttribute,
		[COLOR_MODE_ATTRIBUTE]: colorMode === 'auto' ? (defaultColorMode as string) : colorMode,
	};

	if (getBooleanFF('platform.design-system-team.increased-contrast-themes')) {
		result = {
			...result,
			// CLEANUP: Move this to the initial `result` assignment above
			[CONTRAST_MODE_ATTRIBUTE]:
				contrastMode === 'auto' ? (defaultContrastMode as string) : contrastMode,
		};
	}

	if (UNSAFE_themeOptions && isValidBrandHex(UNSAFE_themeOptions.brandColor)) {
		const optionString = JSON.stringify(UNSAFE_themeOptions);
		const uniqueId = hash(optionString);
		result[CUSTOM_THEME_ATTRIBUTE] = uniqueId;
	}

	return result;
};

export default getThemeHtmlAttrs;
