import { useContext } from 'react';

import { ThemeContext } from './theme-provider';

export const useTheme = () => useContext(ThemeContext);
