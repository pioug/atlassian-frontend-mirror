import { createContext } from 'react';

import type { ThemeState } from '@atlaskit/tokens';

export type Theme = Omit<ThemeState, 'colorMode' | 'contrastMode'>;

/**
 * __Theme context__
 */
export const ThemeContext: import('react').Context<Theme | undefined> = createContext<
	Theme | undefined
>(undefined);

/**
 * __Set theme context__
 */
export const SetThemeContext: import('react').Context<
	((value: Partial<Theme>) => void) | undefined
> = createContext<((value: Partial<Theme>) => void) | undefined>(undefined);
