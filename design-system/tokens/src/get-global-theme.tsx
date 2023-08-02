import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import { ActiveThemeState } from './set-global-theme';
import { DataColorModes, themeColorModes } from './theme-config';
import { themeStringToObject } from './theme-state-transformer';

const isThemeColorMode = (colorMode: string): colorMode is DataColorModes => {
  return themeColorModes.find((mode) => mode === colorMode) !== undefined;
};

const getGlobalTheme = (): Partial<ActiveThemeState> => {
  if (typeof document === 'undefined') {
    return {};
  }

  const element = document.documentElement;
  const colorMode = element.getAttribute(COLOR_MODE_ATTRIBUTE) || '';
  const theme = element.getAttribute(THEME_DATA_ATTRIBUTE) || '';

  return {
    ...(themeStringToObject(theme) as Partial<ActiveThemeState>),
    ...(isThemeColorMode(colorMode) && { colorMode }),
  };
};

export default getGlobalTheme;
