import { useContext, useEffect, useState } from 'react';

import { getGlobalTheme, ThemeMutationObserver } from '@atlaskit/tokens';

import { ColorModeContext, type ReconciledColorMode } from '../context/color-mode';

/**
 * __useColorMode()__
 *
 * Returns the active (reconciled) color mode for the current theme context.
 *
 * When the color mode is set to `'auto'`, this hook returns the resolved value
 * (`'light'` or `'dark'`) based on the system color scheme preference.
 * it will never return `'auto'`. Use `useSetColorMode` to change the color mode.
 *
 * This hook can be used both inside and outside `AppProvider`. When used inside
 * a nested `ThemeProvider`, it reflects the color mode of that sub-tree.
 *
 * @returns The current reconciled color mode: `'light'` or `'dark'`.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const colorMode = useColorMode();
 *
 *   return <p>Current color mode: {colorMode}</p>;
 * }
 * ```
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
