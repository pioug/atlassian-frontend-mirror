/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { SUBTREE_THEME_ATTRIBUTE } from '@atlaskit/tokens/constants';
import {
	CUSTOM_THEME_SCOPE_ATTRIBUTE,
	getThemeAndOverrides,
	type ThemeWithCustomOverrides,
} from '@atlaskit/tokens/custom-theme-overrides';
import { getThemeHtmlAttrs } from '@atlaskit/tokens/get-theme-html-attrs';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';
import type { ThemeColorModes } from '@atlaskit/tokens/theme-color-modes';

import { useIsAppProviderThemingEnabled } from '../use-is-app-provider-theming-enabled';
import { useIsInsideAppProvider } from '../use-is-inside-app-provider';
import { ColorModeContext, type ReconciledColorMode } from './context/color-mode';
import { InsideThemeProviderContext } from './context/inside-theme-provider';
import { SetColorModeContext } from './context/set-color-mode-context';
import { SetThemeContext, type Theme, ThemeContext } from './context/theme';
import { useIsInsideThemeProvider } from './hooks/use-is-inside-theme-provider';
import { getInlineThemeStyles } from './utils/get-inline-theme-styles';
import { loadAndMountThemes } from './utils/load-and-mount-themes';

const defaultThemeSettings: Theme = {
	dark: 'dark',
	light: 'light',
	shape: 'shape',
	spacing: 'spacing',
	typography: 'typography',
};

const isMatchMediaAvailable = typeof window !== 'undefined' && 'matchMedia' in window;

const prefersDarkModeMql = isMatchMediaAvailable
	? window.matchMedia('(prefers-color-scheme: dark)')
	: undefined;

// TODO: currently 'auto' color mode will always return 'light' in SSR.
// Additional work required: https://product-fabric.atlassian.net/browse/DSP-9781
function getReconciledColorMode(colorMode: ThemeColorModes): ReconciledColorMode {
	if (colorMode === 'auto') {
		return prefersDarkModeMql?.matches ? 'dark' : 'light';
	}

	return colorMode;
}

const contentStyles = cssMap({
	body: {
		display: 'contents',
	},
});

export interface ThemeProviderProps {
	defaultColorMode?: ThemeColorModes;
	defaultTheme?: ThemeWithCustomOverrides;
	children: React.ReactNode;
}

/**
 * __Theme provider__
 *
 * Provides global theming configuration.
 */
export function ThemeProvider({
	children,
	defaultColorMode = 'auto',
	defaultTheme,
}: ThemeProviderProps): JSX.Element {
	const [chosenColorMode, setChosenColorMode] = useState<ThemeColorModes>(defaultColorMode);
	const [reconciledColorMode, setReconciledColorMode] = useState<ReconciledColorMode>(
		getReconciledColorMode(defaultColorMode),
	);

	const isInsideAppProvider = useIsInsideAppProvider();
	const isAppProviderThemingEnabled = useIsAppProviderThemingEnabled();
	const isInsideThemeProvider = useIsInsideThemeProvider();
	/**
	 * A top-level ThemeProvider is detected by being the first ThemeProvider inside an AppProvider.
	 *
	 * This will not use sub-tree theming but instead set the global theme state using the
	 * `@atlaskit/tokens` APIs, as it's required for styling root `html` and `body` elements
	 * for compatibility with `@atlaskit/css-reset`.
	 *
	 * In the future we could consider moving away from DOM mutations and require AppProvider to wrap
	 * `html` in order to apply global theme state, which would allow a more consistent approach to
	 * theme loading.
	 */
	const isRootThemeProvider =
		isInsideAppProvider && !isInsideThemeProvider && isAppProviderThemingEnabled;

	/**
	 * Each provider owns its own override stylesheet, so nested providers don't overwrite or remove
	 * each other's overrides. `useId` is stable between the server render and hydration.
	 *
	 * Subtree providers also scope their override selector to their own element. Otherwise every
	 * subtree using the same custom theme would match every provider's overrides, and the last
	 * stylesheet in the document would win. The root provider targets `html`, which subtrees
	 * inherit from.
	 */
	const customThemeOverridesStyleId = useId();
	const { theme: normalizedDefaultTheme, inlineStyles } = getThemeAndOverrides(
		defaultTheme,
		isRootThemeProvider ? undefined : customThemeOverridesStyleId,
	);
	const [theme, setTheme] = useState<Theme>(() => ({
		...defaultThemeSettings,
		...normalizedDefaultTheme,
	}));
	const [hasHoistedInlineThemeStyles, setHasHoistedInlineThemeStyles] = useState(false);

	const setColorMode = useCallback((colorMode: ThemeColorModes) => {
		setChosenColorMode(colorMode);
		setReconciledColorMode(getReconciledColorMode(colorMode));
	}, []);

	const setPartialTheme = useCallback((nextTheme: Partial<Theme>) => {
		setTheme((theme) => ({ ...theme, ...nextTheme }));
	}, []);

	const lastSetGlobalThemePromiseRef = useRef<ReturnType<typeof setGlobalTheme> | null>(null);

	/**
	 * Custom theme overrides apply regardless of `platform-static-theme-loading`: that gate only
	 * controls how the theme stylesheets themselves are loaded.
	 */
	const inlineThemeStylesOverrides = inlineStyles;

	useLayoutEffect(() => {
		return () => {
			document.head
				.querySelector(`style[data-theme-overrides="${customThemeOverridesStyleId}"]`)
				?.remove();
		};
	}, [customThemeOverridesStyleId]);

	useLayoutEffect(() => {
		const isStaticThemeLoadingEnabled = fg('platform-static-theme-loading');

		if (isStaticThemeLoadingEnabled && !hasHoistedInlineThemeStyles) {
			getInlineThemeStyles(theme, chosenColorMode).forEach(({ id, css }) => {
				if (document.head.querySelector(`style[data-theme="${id}"]`)) {
					return;
				}

				const style = document.createElement('style');
				style.dataset.theme = id;
				style.textContent = css;
				document.head.appendChild(style);
			});
		}

		const existingOverrideStyle = document.head.querySelector<HTMLStyleElement>(
			`style[data-theme-overrides="${customThemeOverridesStyleId}"]`,
		);

		if (inlineThemeStylesOverrides) {
			if (existingOverrideStyle) {
				existingOverrideStyle.textContent = inlineThemeStylesOverrides;
			} else {
				const style = document.createElement('style');
				style.dataset.themeOverrides = customThemeOverridesStyleId;
				style.textContent = inlineThemeStylesOverrides;
				document.head.appendChild(style);
			}
		} else {
			existingOverrideStyle?.remove();
		}

		// Only re-render to drop the inline styles when there are any to drop.
		if (
			!hasHoistedInlineThemeStyles &&
			(isStaticThemeLoadingEnabled || inlineThemeStylesOverrides)
		) {
			setHasHoistedInlineThemeStyles(true);
		}
	}, [
		chosenColorMode,
		customThemeOverridesStyleId,
		hasHoistedInlineThemeStyles,
		inlineThemeStylesOverrides,
		theme,
	]);

	useEffect(() => {
		if (isRootThemeProvider) {
			/**
			 * We need to wait for any previous `setGlobalTheme` calls to finish before calling it again.
			 * This is to prevent race conditions as `setGlobalTheme` is async and mutates the DOM (e.g. sets the
			 * `data-color-mode` attribute on the root element).
			 *
			 * Since we can't safely abort the `setGlobalTheme` execution, we need to wait for it to properly finish before
			 * applying the new theme.
			 *
			 * Without this, we can end up in the following scenario:
			 * 1. app loads with the default 'light' theme, kicking off `setGlobalTheme`
			 * 2. app switches to 'dark' theme after retrieving value persisted in local storage, calling `setGlobalTheme` again
			 * 3. `setGlobalTheme` function execution for `dark` finishes before the initial `light` execution
			 * 4. `setGlobalTheme` function execution for `light` then finishes, resulting in the 'light' theme being applied.
			 */
			const cleanupLastFnCall = async () => {
				if (lastSetGlobalThemePromiseRef.current) {
					const unbindFn = await lastSetGlobalThemePromiseRef.current;
					unbindFn();

					lastSetGlobalThemePromiseRef.current = null;
				}
			};

			const safelySetGlobalTheme = async () => {
				await cleanupLastFnCall();

				const promise = setGlobalTheme({
					...theme,
					colorMode: reconciledColorMode,
				});

				lastSetGlobalThemePromiseRef.current = promise;
			};

			safelySetGlobalTheme();

			return function cleanup() {
				cleanupLastFnCall();
			};
		}
		// For other theme providers (whether outside AppProvider or nested inside a ThemeProvider),
		// we treat them as sub-tree themes that do not load global theme state.
		loadAndMountThemes(theme);
	}, [isInsideAppProvider, isInsideThemeProvider, isRootThemeProvider, reconciledColorMode, theme]);

	useEffect(() => {
		if (!prefersDarkModeMql) {
			return;
		}

		const unbindListener = bind(prefersDarkModeMql, {
			type: 'change',
			listener: (event) => {
				if (chosenColorMode === 'auto') {
					setReconciledColorMode(event.matches ? 'dark' : 'light');
				}
			},
		});

		return unbindListener;
	}, [chosenColorMode]);

	const attrs = {
		...getThemeHtmlAttrs({
			...theme,
			colorMode: reconciledColorMode,
		}),
		[SUBTREE_THEME_ATTRIBUTE]: true,
		// Matches this provider's scoped override selector. Only set when there are overrides.
		...(inlineThemeStylesOverrides
			? { [CUSTOM_THEME_SCOPE_ATTRIBUTE]: customThemeOverridesStyleId }
			: {}),
	};
	const inlineThemeStyles =
		fg('platform-static-theme-loading') && !hasHoistedInlineThemeStyles
			? getInlineThemeStyles(theme, chosenColorMode)
			: [];
	return (
		<InsideThemeProviderContext.Provider value={true}>
			<ColorModeContext.Provider value={reconciledColorMode}>
				<SetColorModeContext.Provider value={setColorMode}>
					<ThemeContext.Provider value={theme}>
						<SetThemeContext.Provider value={setPartialTheme}>
							{!isRootThemeProvider ? (
								<div {...attrs} css={contentStyles.body}>
									{!hasHoistedInlineThemeStyles &&
										inlineThemeStylesOverrides && (
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
											<style data-theme-overrides={customThemeOverridesStyleId}>
												{inlineThemeStylesOverrides}
											</style>
										)}
									{inlineThemeStyles.map(({ id, css }) => (
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
										<style data-theme={id} key={id}>
											{css}
										</style>
									))}
									{children}
								</div>
							) : (
								<>
									{!hasHoistedInlineThemeStyles &&
										inlineThemeStylesOverrides && (
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
											<style data-theme-overrides={customThemeOverridesStyleId}>
												{inlineThemeStylesOverrides}
											</style>
										)}
									{inlineThemeStyles.map(({ id, css }) => (
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
										<style data-theme={id} key={id}>
											{css}
										</style>
									))}
									{children}
								</>
							)}
						</SetThemeContext.Provider>
					</ThemeContext.Provider>
				</SetColorModeContext.Provider>
			</ColorModeContext.Provider>
		</InsideThemeProviderContext.Provider>
	);
}
