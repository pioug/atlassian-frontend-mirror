import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import { ThemeState } from './set-global-theme';
import { ThemeColorModes, themeColorModes } from './theme-config';
import { themeStringToObject } from './utils/theme-state-transformer';

const isThemeColorMode = (colorMode: string): colorMode is ThemeColorModes => {
  return themeColorModes.find((mode) => mode === colorMode) !== undefined;
};

export const getGlobalTheme = (): Partial<ThemeState> => {
  if (typeof document === 'undefined') {
    return {};
  }

  const element = document.documentElement;
  const colorMode = element.getAttribute(COLOR_MODE_ATTRIBUTE) || '';
  const theme = element.getAttribute(THEME_DATA_ATTRIBUTE) || '';

  return {
    ...themeStringToObject(theme),
    ...(isThemeColorMode(colorMode) && { colorMode }),
  };
};
