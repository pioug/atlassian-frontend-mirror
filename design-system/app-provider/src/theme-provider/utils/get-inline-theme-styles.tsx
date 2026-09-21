import React from 'react';

import { themeImportMap } from '@atlaskit/tokens/artifacts/theme-import-map';
import { getThemeOverridePreferences } from '@atlaskit/tokens/get-theme-override-preferences';
import { getThemePreferences } from '@atlaskit/tokens/get-theme-preferences';
import type { ThemeColorModes } from '@atlaskit/tokens/theme-color-modes';
import type { ThemeIdsWithOverrides } from '@atlaskit/tokens/theme-config';
import type { ThemeState } from '@atlaskit/tokens/theme-state';

import type { Theme } from '../context/theme';

/**
 * TODO: Remove this React 18 compatibility guard when React 19 has shipped everywhere.
 * At that point, use `import { use } from 'react'` directly.
 */
type ReactUse = <Value>(thenable: PromiseLike<Value>) => Value;

const themeCssPromises = new Map<ThemeIdsWithOverrides, Promise<string>>();

function getThemeCssPromise(themeId: ThemeIdsWithOverrides): Promise<string> {
	let themeCssPromise = themeCssPromises.get(themeId);

	if (!themeCssPromise) {
		themeCssPromise = themeImportMap[themeId]().then(({ default: css }) => css);
		themeCssPromises.set(themeId, themeCssPromise);
	}

	return themeCssPromise;
}

function getInlineThemeCss(themeId: ThemeIdsWithOverrides): string | undefined {
	const reactUse = (React as { use?: ReactUse }).use;

	const isServer =
		(globalThis as { __SERVER__?: boolean }).__SERVER__ === true || typeof document === 'undefined';

	if (isServer) {
		return reactUse?.(getThemeCssPromise(themeId));
	}

	return (
		document.body.querySelector<HTMLStyleElement>(`style[data-theme="${themeId}"]`)?.textContent ??
		undefined
	);
}

export type InlineThemeStyle = {
	id: ThemeIdsWithOverrides;
	css: string;
};

/**
 * Resolves CSS for the themes applied by a ThemeProvider.
 *
 * During React 19 server rendering, `use()` suspends the provider subtree until
 * each requested CSS chunk is available. The resulting styles are rendered
 * immediately before that subtree. React 18 does not provide `use()`, so it
 * safely follows the existing path without inline CSS. During hydration, the CSS
 * is read from server-rendered style elements so the initial client tree matches.
 */
export function getInlineThemeStyles(theme: Theme, colorMode: ThemeColorModes): InlineThemeStyle[] {
	const themeState: ThemeState = {
		...theme,
		colorMode,
		contrastMode: 'no-preference',
	};
	const themeIds = [...getThemePreferences(themeState), ...getThemeOverridePreferences(themeState)];

	return [...new Set(themeIds)]
		.map((themeId) => {
			const css = getInlineThemeCss(themeId);

			return css ? { id: themeId, css } : undefined;
		})
		.filter((style): style is InlineThemeStyle => style !== undefined);
}
