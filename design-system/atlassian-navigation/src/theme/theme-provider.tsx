import { type Context, createContext, type Provider } from 'react';

import { defaultTheme } from './themes';
import type { NavigationTheme } from './types';

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ThemeContext: Context<NavigationTheme> = createContext(defaultTheme);

/**
 * __Theme provider__
 *
 * A provider for the theme context used by all navigation components.
 */
export const ThemeProvider: Provider<NavigationTheme> = ThemeContext.Provider;
