import { createContext, useContext } from 'react';

/**
 * Context to let components know if a custom theme is being applied.
 */
export const HasCustomThemeContext: import("react").Context<boolean> = createContext(false);

/**
 * Returns whether a custom theme is being applied.
 */
export function useHasCustomTheme(): boolean {
	return useContext(HasCustomThemeContext);
}
