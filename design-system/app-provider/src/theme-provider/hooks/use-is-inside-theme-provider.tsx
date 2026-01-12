import { useContext } from 'react';

import { InsideThemeProviderContext } from '../context/inside-theme-provider';

/**
 * __useIsInsideThemeProvider()__
 *
 * Returns true if the current component is inside a ThemeProvider.
 */
export const useIsInsideThemeProvider = (): boolean => {
	return useContext(InsideThemeProviderContext) ?? false;
};
