import { createContext } from 'react';

import type { ThemeState } from '@atlaskit/tokens';

export type Theme = Omit<ThemeState, 'colorMode' | 'contrastMode'>;

/**
 * __Theme context__
 */
export const ThemeContext = createContext<Theme | undefined>(undefined);

/**
 * __Set theme context__
 */
export const SetThemeContext = createContext<((value: Partial<Theme>) => void) | undefined>(
	undefined,
);
