import { getDocument } from '@atlaskit/browser-apis';
import { type ThemeIds, themeImportMap, type ThemeState } from '@atlaskit/tokens';

import { isThemeMounted } from './is-theme-mounted';

const loadThemeCss = async (themeId: ThemeIds) => {
	// Prevent duplicate loading of themes
	if (isThemeMounted(themeId)) {
		return;
	}

	// Gracefully handles falsy values like `null` and `undefined` when makers ignore
	// TS to avoid loading default themes.
	if (!themeId) {
		return;
	}

	const { default: themeCss } = await themeImportMap[themeId]();

	return themeCss;
};

const mountThemeCss = async (css: string, themeId: ThemeIds) => {
	// SSR-safe: Only mount on client side
	const doc = getDocument();
	if (!doc) {
		return;
	}

	const style = doc.createElement('style');
	style.textContent = css;
	style.dataset.theme = themeId;

	// Prevent duplicate mounting of themes.
	// It's possible the theme was already being loaded elsewhere.
	if (isThemeMounted(themeId)) {
		return;
	}

	doc.head.appendChild(style);
};

const loadAndMountThemeCss = async (themeId: ThemeIds) => {
	const themeCss = await loadThemeCss(themeId);

	if (!themeCss) {
		return;
	}

	mountThemeCss(themeCss, themeId);
};

export const loadAndMountThemes = async (themeState: Partial<ThemeState>) => {
	const themesToLoad = [
		themeState.light,
		themeState.dark,
		themeState.spacing,
		themeState.shape,
		themeState.typography,
	].filter((themeId): themeId is ThemeIds => !!themeId);

	themesToLoad.forEach(loadAndMountThemeCss);
};
