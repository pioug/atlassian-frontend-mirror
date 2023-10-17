import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { ThemeIdsWithOverrides, ThemeState } from '../theme-config';

import getIncreasedContrastTheme from './get-increased-contrast-theme';

export const getThemePreferences = (
  themeState: ThemeState,
): ThemeIdsWithOverrides[] => {
  const { colorMode, contrastMode, dark, light, shape, spacing, typography } =
    themeState;

  const autoColorModeThemes: ThemeIdsWithOverrides[] = [light, dark];
  const themePreferences: ThemeIdsWithOverrides[] = [];

  if (colorMode === 'auto') {
    if (
      contrastMode !== 'no-preference' &&
      getBooleanFF('platform.design-system-team.increased-contrast-themes')
    ) {
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

    if (
      contrastMode !== 'no-preference' &&
      getBooleanFF('platform.design-system-team.increased-contrast-themes')
    ) {
      const increasedContrastTheme = getIncreasedContrastTheme(
        themeState[colorMode],
      );

      if (increasedContrastTheme) {
        themePreferences.push(increasedContrastTheme);
      }
    }
  }

  [shape, spacing, typography].forEach((themeId) => {
    if (themeId) {
      themePreferences.push(themeId);
    }
  });

  return [...new Set(themePreferences)];
};

export const getThemeOverridePreferences = (
  themeState: ThemeState,
): ThemeIdsWithOverrides[] => {
  const { colorMode, dark, light } = themeState;

  const themeOverridePreferences: ThemeIdsWithOverrides[] = [];

  const themePreferences: ThemeIdsWithOverrides[] =
    colorMode === 'auto' ? [light, dark] : [themeState[colorMode]];

  if (getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')) {
    themePreferences.includes('light') &&
      themeOverridePreferences.push('light-new-input-border');
    themePreferences.includes('dark') &&
      themeOverridePreferences.push('dark-new-input-border');
  }

  return [...new Set(themeOverridePreferences)];
};
