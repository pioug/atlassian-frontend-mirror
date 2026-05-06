import { CUSTOM_THEME_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../constants';
import { type ThemeIdsWithOverrides } from '../theme-config';

import { loadThemeCss } from './load-theme-css';
export const loadAndAppendThemeCss = async (themeId: ThemeIdsWithOverrides): Promise<void> => {
	if (
		document.head.querySelector(
			`style[${THEME_DATA_ATTRIBUTE}="${themeId}"]:not([${CUSTOM_THEME_ATTRIBUTE}])`,
		)
	) {
		return;
	}

	// Gracefully handles falsy values like `null` and `undefined` when maker ignore TS
	// to avoid loading default themes.
	if (!themeId) {
		return;
	}

	const themeCss = await loadThemeCss(themeId);

	const style = document.createElement('style');
	style.textContent = themeCss;
	style.dataset.theme = themeId;
	document.head.appendChild(style);
};

export const darkModeMediaQuery = '(prefers-color-scheme: dark)';
export const moreContrastMediaQuery = '(prefers-contrast: more)';

export { loadThemeCss } from './load-theme-css';
