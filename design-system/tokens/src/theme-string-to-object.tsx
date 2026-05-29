import { isColorMode } from './is-color-mode';
import { isThemeIds } from './is-theme-ids';
import { isThemeKind } from './is-theme-kind';
import type { ThemeState } from './theme-config';

const customThemeOptions = 'UNSAFE_themeOptions';

/**
 * Converts a string that is formatted for the `data-theme` HTML attribute
 * to an object that can be passed to `setGlobalTheme`.
 *
 * @param {string} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeStringToObject('dark:dark light:light spacing:spacing');
 * // returns { dark: 'dark', light: 'light', spacing: 'spacing' }
 * ```
 */
export const themeStringToObject = (themeState: string): Partial<ThemeState> => {
	return (
		themeState
			.split(' ')
			// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
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
					} catch {
						new Error('Invalid custom theme string');
					}
				}

				return themeObject;
			}, {})
	);
};
