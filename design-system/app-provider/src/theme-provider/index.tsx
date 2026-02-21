/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	getThemeHtmlAttrs,
	setGlobalTheme,
	SUBTREE_THEME_ATTRIBUTE,
	type ThemeColorModes,
} from '@atlaskit/tokens';

import { useIsAppProviderThemingEnabled, useIsInsideAppProvider } from '../context';

import {
	ColorModeContext,
	type ReconciledColorMode,
	SetColorModeContext,
} from './context/color-mode';
import { InsideThemeProviderContext } from './context/inside-theme-provider';
import { SetThemeContext, type Theme, ThemeContext } from './context/theme';
import { useIsInsideThemeProvider } from './hooks/use-is-inside-theme-provider';
import { loadAndMountThemes } from './utils/load-and-mount-themes';

const defaultThemeSettings: Theme = {
	dark: 'dark',
	light: 'light',
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
	defaultTheme?: Partial<Theme>;
	children: React.ReactNode;
}

/**
 * __Theme provider__
 *
 * Provides global theming configuration.
 */
function ThemeProvider({
	children,
	defaultColorMode = 'auto',
	defaultTheme,
}: ThemeProviderProps): JSX.Element {
	const [chosenColorMode, setChosenColorMode] = useState<ThemeColorModes>(defaultColorMode);
	const [reconciledColorMode, setReconciledColorMode] = useState<ReconciledColorMode>(
		getReconciledColorMode(defaultColorMode),
	);

	const [theme, setTheme] = useState<Theme>(() => ({
		...defaultThemeSettings,
		...defaultTheme,
	}));

	const setColorMode = useCallback((colorMode: ThemeColorModes) => {
		setChosenColorMode(colorMode);
		setReconciledColorMode(getReconciledColorMode(colorMode));
	}, []);

	const setPartialTheme = useCallback((nextTheme: Partial<Theme>) => {
		setTheme((theme) => ({ ...theme, ...nextTheme }));
	}, []);

	const lastSetGlobalThemePromiseRef = useRef<ReturnType<typeof setGlobalTheme> | null>(null);

	const isInsideAppProvider = useIsInsideAppProvider();
	const isAppProviderThemingEnabled = useIsAppProviderThemingEnabled();
	const isInsideThemeProvider = useIsInsideThemeProvider();
	const isRootThemeProvider =
		isInsideAppProvider && !isInsideThemeProvider && isAppProviderThemingEnabled;

	const shouldUseGlobalTheming =
		/**
		 * When not behind feature flag, partially revert to legacy behavior.
		 * This only affects theme providers that are not inside an AppProvider or a ThemeProvider,
		 * as we still need to set global theme state to prevent breaking existing apps,
		 * but also prevent multiple theme providers from loading conflicting theme states.
		 *
		 * At some point this should be removed as we will
		 * only support sub-tree theming when used inside of AppProvider.
		 */
		(!fg('platform_dst_subtree_theming') && !isInsideAppProvider && !isInsideThemeProvider) ||
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
		isRootThemeProvider;

	useEffect(() => {
		if (shouldUseGlobalTheming) {
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
		} else {
			// For other theme providers (whether outside AppProvider or nested inside a ThemeProvider),
			// we treat them as sub-tree themes that do not load global theme state.
			loadAndMountThemes(theme);
		}
	}, [
		isInsideAppProvider,
		isInsideThemeProvider,
		isRootThemeProvider,
		reconciledColorMode,
		shouldUseGlobalTheming,
		theme,
	]);

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
	};

	return (
		<InsideThemeProviderContext.Provider value={true}>
			<ColorModeContext.Provider value={reconciledColorMode}>
				<SetColorModeContext.Provider value={setColorMode}>
					<ThemeContext.Provider value={theme}>
						<SetThemeContext.Provider value={setPartialTheme}>
							{!shouldUseGlobalTheming && fg('platform_dst_subtree_theming') ? (
								<div {...attrs} css={contentStyles.body}>
									{children}
								</div>
							) : (
								children
							)}
						</SetThemeContext.Provider>
					</ThemeContext.Provider>
				</SetColorModeContext.Provider>
			</ColorModeContext.Provider>
		</InsideThemeProviderContext.Provider>
	);
}

export default ThemeProvider;
