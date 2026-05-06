import { type ThemeIdsWithOverrides, type ThemeState } from '../theme-config';

export const getThemeOverridePreferences = (_themeState: ThemeState): ThemeIdsWithOverrides[] => {
	const themeOverridePreferences: ThemeIdsWithOverrides[] = [];

	return [...new Set(themeOverridePreferences)];
};
