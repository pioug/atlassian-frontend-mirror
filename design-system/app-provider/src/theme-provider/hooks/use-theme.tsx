import { useContext, useEffect, useState } from 'react';

import { getGlobalTheme, ThemeMutationObserver } from '@atlaskit/tokens';

import { type Theme, ThemeContext } from '../context/theme';

/**
 * __useTheme()__
 *
 * Returns the current theme settings for the nearest `ThemeProvider` in the
 * React tree.
 *
 * The returned object contains the named theme IDs for each slot: `light`,
 * `dark`, `spacing`, and `typography`. Use `useSetTheme` to change these
 * values at runtime.
 *
 * This hook can be used both inside and outside `AppProvider`. When used
 * inside a nested `ThemeProvider`, it reflects the theme of that sub-tree.
 *
 * @returns The current theme settings object.
 *
 * @example
 * ```tsx
 * function ThemeDisplay() {
 *   const theme = useTheme();
 *
 *   return (
 *     <p>
 *       Light theme: {theme.light}, Dark theme: {theme.dark}
 *     </p>
 *   );
 * }
 * ```
 */
export function useTheme(): Partial<Theme> {
	const theme = useContext(ThemeContext);
	const [resolvedTheme, setResolvedTheme] = useState(theme || getGlobalTheme());

	useEffect(() => {
		// We are using theme from context so no need to reference the DOM
		if (theme) {
			return;
		}

		const observer = new ThemeMutationObserver(setResolvedTheme);
		observer.observe();
		return () => observer.disconnect();
	}, [theme]);

	return theme ? theme : resolvedTheme;
}
