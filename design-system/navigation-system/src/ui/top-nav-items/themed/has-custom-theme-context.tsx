import { createContext, useContext } from 'react';

/**
 * Context to let components know if a custom theme is being applied.
 */
export const HasCustomThemeContext = createContext(false);

/**
 * Returns whether a custom theme is being applied.
 */
export function useHasCustomTheme() {
	return useContext(HasCustomThemeContext);
}
