import { createContext } from 'react';

import { defaultTheme } from './themes';

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ThemeContext = createContext(defaultTheme);

/**
 * __Theme provider__
 *
 * A provider for the theme context used by all navigation components.
 */
export const ThemeProvider = ThemeContext.Provider;
