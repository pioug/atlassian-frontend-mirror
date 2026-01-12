import { useContext, useEffect, useState } from 'react';

import { getGlobalTheme, ThemeMutationObserver } from '@atlaskit/tokens';

import { ColorModeContext, type ReconciledColorMode } from '../context/color-mode';

/**
 * __useColorMode()__
 *
 * Returns the current color mode when inside the app provider.
 */
export function useColorMode(): ReconciledColorMode {
	const value = useContext(ColorModeContext);

	// TODO: This will only return 'light' or 'dark' but never 'auto', which in some cases
	// may be desirable. We should consider returning both the reconciled color mode (e.g. 'light' or 'dark') and the selected color mode ("auto").
	const theme = getGlobalTheme();
	const [resolvedColorMode, setResolvedColorMode] = useState(theme?.colorMode || 'light');

	useEffect(() => {
		// We are using theme from context so no need to reference the DOM
		if (value) {
			return;
		}

		const observer = new ThemeMutationObserver((theme) => {
			setResolvedColorMode(theme?.colorMode || 'light');
		});
		observer.observe();
		return () => observer.disconnect();
	}, [value]);

	return value ? value : resolvedColorMode;
}
