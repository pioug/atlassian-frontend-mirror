import { themeColorModes } from './theme-color-modes';
import type { DataColorModes } from './theme-config';

export const isThemeColorMode = (colorMode: string): colorMode is DataColorModes => {
	return themeColorModes.find((mode) => mode === colorMode) !== undefined;
};
