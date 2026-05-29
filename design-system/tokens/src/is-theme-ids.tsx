import type { ThemeIds } from './theme-config';
import { themeIds } from './theme-ids';

export const isThemeIds = (themeId: string): themeId is ThemeIds => {
	return themeIds.find((id) => id === themeId) !== undefined;
};
