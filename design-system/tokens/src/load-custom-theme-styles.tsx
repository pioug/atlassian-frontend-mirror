import { loadAndAppendCustomThemeCss } from './custom-theme';
import { type ThemeState, themeStateDefaults } from './theme-config';
import { isValidBrandHex } from './utils/color-utils';
import { findMissingCustomStyleElements } from './utils/custom-theme-loading-utils';

/**
 * Synchronously generates and applies custom theme styles to the page.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @example
 * ```
 * UNSAFE_loadCustomThemeStyles({
 *    colorMode: 'auto',
 *    UNSAFE_themeOptions: { brandColor: '#FF0000' }
 * });
 * ```
 */
const UNSAFE_loadCustomThemeStyles = ({
	colorMode = themeStateDefaults['colorMode'],
	UNSAFE_themeOptions = themeStateDefaults['UNSAFE_themeOptions'],
}: Partial<ThemeState> = {}): void => {
	// Load custom theme styles
	if (UNSAFE_themeOptions && isValidBrandHex(UNSAFE_themeOptions?.brandColor)) {
		const attrOfMissingCustomStyles = findMissingCustomStyleElements(
			UNSAFE_themeOptions,
			colorMode,
		);
		if (attrOfMissingCustomStyles.length !== 0) {
			loadAndAppendCustomThemeCss({
				colorMode:
					attrOfMissingCustomStyles.length === 2
						? 'auto'
						: // only load the missing custom theme styles
							attrOfMissingCustomStyles[0],
				UNSAFE_themeOptions,
			});
		}
	}
};

export default UNSAFE_loadCustomThemeStyles;
