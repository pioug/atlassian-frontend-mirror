import type { ThemeColorModes } from './theme-color-modes';

export const isColorMode = (modeId: string): modeId is ThemeColorModes => {
	return ['light', 'dark', 'auto'].includes(modeId);
};
