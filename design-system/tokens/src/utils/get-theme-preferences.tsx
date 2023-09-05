import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { ThemeIdsWithOverrides, ThemeState } from '../theme-config';

export const getThemePreferences = (
  themeState: ThemeState,
): ThemeIdsWithOverrides[] => {
  const { colorMode, dark, light, shape, spacing, typography } = themeState;

  const themePreferences: ThemeIdsWithOverrides[] =
    colorMode === 'auto' ? [light, dark] : [themeState[colorMode]];

  [shape, spacing, typography].forEach((themeId) => {
    if (themeId) {
      themePreferences.push(themeId);
    }
  });

  if (getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')) {
    themePreferences.push(
      `${
        themePreferences.includes('dark') ? 'dark' : 'light'
      }-new-input-border`,
    );
  }

  // Load spacing by default
  if (!themePreferences.includes('spacing')) {
    themePreferences.push('spacing');
  }

  return [...new Set(themePreferences)];
};
