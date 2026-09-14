import { themeIds, type ThemeIds } from './theme-ids';

export const isThemeIds = (themeId: string): themeId is ThemeIds => {
	return themeIds.find((id) => id === themeId) !== undefined;
};
