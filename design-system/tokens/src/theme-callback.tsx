import { type ActiveThemeState } from './theme-config';

export type ThemeCallback = (theme: Partial<ActiveThemeState>) => unknown;
