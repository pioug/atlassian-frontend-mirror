import themeConfig, { ThemeIds, ThemeOverrideIds } from '../theme-config';

/**
 * Finds any matching increased contrast theme available for a selected theme.
 */
export default function getIncreasedContrastTheme(
  themeId: ThemeIds | ThemeOverrideIds,
): ThemeIds | ThemeOverrideIds | undefined {
  return Object.entries(themeConfig).find(([, { increasesContrastFor }]) => {
    return increasesContrastFor === themeId;
  })?.[1].id;
}
