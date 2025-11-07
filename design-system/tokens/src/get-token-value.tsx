import warnOnce from '@atlaskit/ds-lib/warn-once';

import tokens from './artifacts/token-names';

type Tokens = typeof tokens;

/**
 * Takes a dot-separated token name and and an optional fallback, and returns the current computed CSS value for the
 * resulting CSS Custom Property.
 * This should be used for when the CSS cascade isn't available, eg. `<canvas>` elements, JS charting libraries, etc.
 *
 * Note: these values change depending on the theme so consider pairing them with `useThemeObserver` in React, or the
 * `ThemeMutationObserver` class elsewhere.
 *
 * @param {string} path - A dot-separated token name (example: `'color.background.brand'` or `'spacing.scale.100'`).
 * @param {string} [fallback] - The fallback value that should render when token CSS is not present in your app.
 *
 * @example
 * ```
 * const theme = useThemeObserver();
 *
 * useEffect(() => {
 *  const lineColor = getTokenValue('color.background.accent.blue.subtle', B400);
 * }, [theme]);
 * ```
 *
 */
function getTokenValue<T extends keyof Tokens>(tokenId: T, fallback: string = ''): string {
	let token: Tokens[keyof Tokens] | '' = tokens[tokenId];
	let tokenValue = fallback;

	if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
		if (!token) {
			warnOnce(`Unknown token id at path: ${tokenId} in @atlaskit/tokens`);
		}
	}

	if (typeof window === 'undefined') {
		return tokenValue;
	}

	tokenValue = window.getComputedStyle(document.documentElement).getPropertyValue(token).trim();

	tokenValue = tokenValue || fallback;

	return tokenValue;
}

export default getTokenValue;
