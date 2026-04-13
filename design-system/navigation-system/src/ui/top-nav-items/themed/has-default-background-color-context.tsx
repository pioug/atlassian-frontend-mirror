import { createContext } from 'react';

/**
 * Context to let components know if the top nav background color is the default background color,
 * even while a custom theme is being applied.
 */
export const HasDefaultBackgroundColorContext: import('react').Context<boolean> =
	createContext(true);
