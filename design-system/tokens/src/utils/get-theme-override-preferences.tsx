import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type ThemeIdsWithOverrides, type ThemeOverrideIds } from '../theme-config';
import { type ThemeIds } from '../theme-ids';
import { type ThemeState } from '../theme-state';
import getIncreasedContrastTheme from './get-increased-contrast-theme';

const finesseOverrides: Partial<Record<ThemeIds, ThemeOverrideIds>> = {
	light: 'light-finesse',
	'light-increased-contrast': 'light-increased-contrast-finesse',
	dark: 'dark-finesse',
	'dark-increased-contrast': 'dark-increased-contrast-finesse',
	typography: 'typography-finesse',
};

export const getThemeOverridePreferences = (themeState: ThemeState): ThemeIdsWithOverrides[] => {
	if (!fg('platform-dst-tokens-finesse')) {
		return [];
	}

	const { colorMode, contrastMode, dark, light, typography } = themeState;
	const selectedThemes: ThemeIds[] = [
		...(colorMode === 'auto' ? [light, dark] : [themeState[colorMode]]),
		typography,
	];

	if (contrastMode !== 'no-preference' && fg('platform_increased-contrast-themes')) {
		selectedThemes.forEach((themeId) => {
			const increasedContrastTheme = getIncreasedContrastTheme(themeId);
			if (increasedContrastTheme) {
				selectedThemes.push(increasedContrastTheme as ThemeIds);
			}
		});
	}

	const themeOverridePreferences = selectedThemes
		.map((themeId) => finesseOverrides[themeId])
		.filter((themeId): themeId is ThemeOverrideIds => themeId !== undefined);

	return [...new Set(themeOverridePreferences)];
};
