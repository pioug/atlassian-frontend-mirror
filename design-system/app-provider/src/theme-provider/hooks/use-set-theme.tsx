import { useContext } from 'react';

import { SetThemeContext, type Theme } from '../context/theme';

/**
 * __useSetTheme()__
 *
 * Returns a function that partially updates the theme settings for the nearest
 * `ThemeProvider` in the React tree.
 *
 * Pass a partial `Theme` object to update one or more theme slots (`light`,
 * `dark`, `spacing`, `typography`). Unspecified slots will retain their current
 * values. The updated theme is merged with the existing theme state.
 *
 * This hook must be called from within a `ThemeProvider` (or `AppProvider`).
 * It throws if no `ThemeProvider` is found in the tree.
 *
 * @returns A setter function that accepts a partial `Theme` object.
 *
 * @example
 * ```tsx
 * function ThemeSwitcher() {
 *   const setTheme = useSetTheme();
 *
 *   return (
 *     <button onClick={() => setTheme({ light: 'light', dark: 'dark' })}>
 *       Reset to default theme
 *     </button>
 *   );
 * }
 * ```
 */
export function useSetTheme(): (value: Partial<Theme>) => void {
	const value = useContext(SetThemeContext);
	if (!value) {
		throw new Error('useSetTheme must be used within ThemeProvider.');
	}

	return value;
}
