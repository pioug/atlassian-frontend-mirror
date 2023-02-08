import themeImportMap from '../artifacts/theme-import-map';
import { THEME_DATA_ATTRIBUTE } from '../constants';
import { ThemeIds } from '../theme-config';

export const loadAndAppendThemeCss = async (themeId: ThemeIds) => {
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

export const loadThemeCss = async (themeId: ThemeIds) => {
  const { default: themeCss } = await themeImportMap[themeId]();
  return themeCss;
};
