import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { themeImportMap } from '@atlaskit/tokens/artifacts/theme-import-map';
import { getThemeOverridePreferences } from '@atlaskit/tokens/get-theme-override-preferences';
import { getThemePreferences } from '@atlaskit/tokens/get-theme-preferences';
import type { ThemeIdsWithOverrides } from '@atlaskit/tokens/theme-config';
import type { ThemeIds } from '@atlaskit/tokens/theme-ids';
import type { ThemeState } from '@atlaskit/tokens/theme-state';

import { type Theme } from '../context/theme';
import { isThemeMounted } from './is-theme-mounted';

const loadThemeCss = async (themeId: ThemeIdsWithOverrides) => {
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

const mountThemeCss = (css: string, themeId: ThemeIdsWithOverrides) => {
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

export const loadAndMountThemes = async (theme: Theme): Promise<void> => {
	if (fg('platform-dst-tokens-finesse')) {
		const themeState: ThemeState = {
			...theme,
			// Keep both configured color themes available for subtree color-mode changes.
			colorMode: 'auto',
			contrastMode: 'no-preference',
		};
		const themeIds = [
			...new Set([...getThemePreferences(themeState), ...getThemeOverridePreferences(themeState)]),
		];
		const themes = await Promise.allSettled(
			themeIds.map(async (id) => ({ id, css: await loadThemeCss(id) })),
		);

		// Imports may resolve in any order. Mount bases before overrides, even when
		// multiple providers are loading the same styles at the same time. A failed
		// import must not prevent successfully loaded styles from mounting.
		themes.forEach((result) => {
			if (result.status === 'fulfilled' && result.value.css) {
				mountThemeCss(result.value.css, result.value.id);
			}
		});
		return;
	}

	const themesToLoad = Object.values(theme).filter((themeId): themeId is ThemeIds => !!themeId);

	themesToLoad.forEach(loadAndMountThemeCss);
};
