import { type ThemeColorModes, type ThemeIds, themeIds, type ThemeState } from './theme-config';

const themeKinds = ['light', 'dark', 'spacing', 'typography', 'shape'] as const;
type ThemeKind = (typeof themeKinds)[number];

const customThemeOptions = 'UNSAFE_themeOptions';

const isThemeKind = (themeKind: string): themeKind is ThemeKind => {
	return themeKinds.find((kind) => kind === themeKind) !== undefined;
};

const isThemeIds = (themeId: string): themeId is ThemeIds => {
	return themeIds.find((id) => id === themeId) !== undefined;
};

const isColorMode = (modeId: string): modeId is ThemeColorModes => {
	return ['light', 'dark', 'auto'].includes(modeId);
};
/**
 * Converts a string that is formatted for the `data-theme` HTML attribute
 * to an object that can be passed to `setGlobalTheme`.
 *
 * @param {string} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeStringToObject('dark:dark light:legacy-light spacing:spacing');
 * // returns { dark: 'dark', light: 'legacy-light', spacing: 'spacing' }
 * ```
 */
export const themeStringToObject = (themeState: string): Partial<ThemeState> => {
	return themeState
		.split(' ')
		.map((theme) => theme.split(/:(.*)/s))
		.reduce<Partial<ThemeState>>((themeObject, [kind, id]) => {
			if (kind === 'colorMode' && isColorMode(id)) {
				themeObject[kind] = id;
			}

			if (isThemeKind(kind) && isThemeIds(id)) {
				// @ts-expect-error FIXME - this is a valid ts error
				themeObject[kind] = id;
			}

			if (kind === customThemeOptions) {
				try {
					themeObject[customThemeOptions] = JSON.parse(id);
				} catch (e) {
					new Error('Invalid custom theme string');
				}
			}

			return themeObject;
		}, {});
};

/**
 * Converts a theme object to a string formatted for the `data-theme` HTML attribute.
 *
 * @param {object} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeObjectToString({ dark: 'dark', light: 'legacy-light', spacing: 'spacing' });
 * // returns 'dark:dark light:legacy-light spacing:spacing'
 * ```
 */
export const themeObjectToString = (themeState: Partial<ThemeState>): string =>
	Object.entries(themeState).reduce<string>((themeString, [kind, id]) => {
		if (
			// colorMode theme state
			(kind === 'colorMode' && typeof id === 'string' && isColorMode(id)) ||
			// custom theme state
			(kind === customThemeOptions && typeof id === 'object') ||
			// other theme states
			(isThemeKind(kind) && typeof id === 'string' && isThemeIds(id))
		) {
			return (
				themeString +
				`${themeString ? ' ' : ''}` +
				`${kind}:${typeof id === 'object' ? JSON.stringify(id) : id}`
			);
		}

		return themeString;
	}, '');
