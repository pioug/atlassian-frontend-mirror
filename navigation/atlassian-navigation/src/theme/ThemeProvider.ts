import { createContext } from 'react';

import { defaultTheme } from './themes';

export const ThemeContext = createContext(defaultTheme);

export const ThemeProvider = ThemeContext.Provider;
