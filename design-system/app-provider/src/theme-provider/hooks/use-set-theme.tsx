import { useContext } from 'react';

import { SetThemeContext, type Theme } from '../context/theme';

/**
 * __useSetTheme()__
 *
 * Returns the theme setter when inside the app provider.
 */
export function useSetTheme(): (value: Partial<Theme>) => void {
	const value = useContext(SetThemeContext);
	if (!value) {
		throw new Error('useSetTheme must be used within ThemeProvider.');
	}

	return value;
}
