import { useContext, useEffect, useState } from 'react';

import { getGlobalTheme, ThemeMutationObserver } from '@atlaskit/tokens';

import { type Theme, ThemeContext } from '../context/theme';

/**
 * __useTheme()__
 *
 * Returns the current theme settings when inside the app provider.
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
