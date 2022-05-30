import { THEMES } from './constants';
import type { Themes } from './types';

const setGlobalTheme = (theme: Themes) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!THEMES.includes(theme)) {
      throw new Error(
        `setGlobalTheme only accepts themes: ${THEMES.join(', ')}`,
      );
    }
  }

  const element = document.documentElement;
  element.setAttribute('data-theme', theme);
};

export default setGlobalTheme;
