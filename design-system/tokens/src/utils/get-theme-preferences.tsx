import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type ThemeIdsWithOverrides } from '../theme-config';
import { type ThemeState } from '../theme-state';
import getIncreasedContrastTheme from './get-increased-contrast-theme';

export const getThemePreferences = (themeState: ThemeState): ThemeIdsWithOverrides[] => {
	const { colorMode, contrastMode, dark, light, shape, spacing, typography, motion } = themeState;

	const autoColorModeThemes: ThemeIdsWithOverrides[] = [light, dark];
	const themePreferences: ThemeIdsWithOverrides[] = [];

	if (colorMode === 'auto') {
		if (contrastMode !== 'no-preference' && fg('platform_increased-contrast-themes')) {
			autoColorModeThemes.forEach((normalTheme) => {
				const increasedContrastTheme = getIncreasedContrastTheme(normalTheme);
				if (increasedContrastTheme) {
					autoColorModeThemes.push(increasedContrastTheme);
				}
			});
		}

		themePreferences.push(...autoColorModeThemes);
	} else {
		themePreferences.push(themeState[colorMode]);

		if (contrastMode !== 'no-preference' && fg('platform_increased-contrast-themes')) {
			const increasedContrastTheme = getIncreasedContrastTheme(themeState[colorMode]);

			if (increasedContrastTheme) {
				themePreferences.push(increasedContrastTheme);
			}
		}
	}

	[shape, spacing, typography, motion].forEach((themeId) => {
		if (themeId) {
			themePreferences.push(themeId);
		}
	});

	return [...new Set(themePreferences)];
};
