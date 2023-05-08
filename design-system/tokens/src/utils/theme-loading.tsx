import themeImportMap from '../artifacts/theme-import-map';
import { THEME_DATA_ATTRIBUTE } from '../constants';
import { ThemeIds, ThemeOverrideIds } from '../theme-config';

export const loadAndAppendThemeCss = async (
  themeId: ThemeIds | ThemeOverrideIds,
) => {
  if (
    document.head.querySelector(`style[${THEME_DATA_ATTRIBUTE}="${themeId}"]`)
  ) {
    return;
  }

  const themeCss = await loadThemeCss(themeId);

  const style = document.createElement('style');
  style.textContent = themeCss;
  style.dataset.theme = themeId;
  document.head.appendChild(style);
};

export const loadThemeCss = async (themeId: ThemeIds | ThemeOverrideIds) => {
  const { default: themeCss } = await themeImportMap[themeId]();
  return themeCss;
};
