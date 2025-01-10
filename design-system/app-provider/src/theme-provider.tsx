import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';
import { setGlobalTheme, type ThemeState } from '@atlaskit/tokens';

export type Theme = Omit<ThemeState, 'colorMode' | 'contrastMode'>;
export type ColorMode = 'light' | 'dark' | 'auto';
export type ReconciledColorMode = Exclude<ColorMode, 'auto'>;

const defaultThemeSettings: Theme = {
	dark: 'dark',
	light: 'light',
	spacing: 'spacing',
};

const ColorModeContext = createContext<ReconciledColorMode | undefined>(undefined);

const SetColorModeContext = createContext<((value: ColorMode) => void) | undefined>(undefined);

const ThemeContext = createContext<Theme | undefined>(undefined);

const SetThemeContext = createContext<((value: Partial<Theme>) => void) | undefined>(undefined);

/**
 * __UNSAFE_useColorModeForMigration()__
 *
 * Returns the current color mode when inside the app provider.
 * Unlike useColorMode, this utility returns undefined, instead of throwing an error, when the app provider is missing.
 * This allows it to be used by components that need to operate with and without an app provider.
 */
export function UNSAFE_useColorModeForMigration(): ReconciledColorMode | undefined {
	const value = useContext(ColorModeContext);
	return value;
}

/**
 * __useColorMode()__
 *
 * Returns the current color mode when inside the app provider.
 */
export function useColorMode(): ReconciledColorMode {
	const value = useContext(ColorModeContext);
	if (!value) {
		throw new Error('useColorMode must be used within AppProvider.');
	}

	return value;
}

/**
 * __useSetColorMode()__
 *
 * Returns the color mode setter when inside the app provider.
 */
export function useSetColorMode(): (value: ColorMode) => void {
	const value = useContext(SetColorModeContext);
	if (!value) {
		throw new Error('useSetColorMode must be used within AppProvider.');
	}

	return value;
}

/**
 * __useTheme()__
 *
 * Returns the current theme settings when inside the app provider.
 */
export function useTheme(): Theme {
	const value = useContext(ThemeContext);
	if (!value) {
		throw new Error('useTheme must be used within AppProvider.');
	}

	return value;
}

/**
 * __useSetTheme()__
 *
 * Returns the theme setter when inside the app provider.
 */
export function useSetTheme(): (value: Partial<Theme>) => void {
	const value = useContext(SetThemeContext);
	if (!value) {
		throw new Error('useSetTheme must be used within AppProvider.');
	}

	return value;
}

const isMatchMediaAvailable = typeof window !== 'undefined' && 'matchMedia' in window;

const prefersDarkModeMql = isMatchMediaAvailable
	? window.matchMedia('(prefers-color-scheme: dark)')
	: undefined;

// TODO: currently 'auto' color mode will always return 'light' in SSR.
// Additional work required: https://product-fabric.atlassian.net/browse/DSP-9781
function getReconciledColorMode(colorMode: ColorMode): ReconciledColorMode {
	if (colorMode === 'auto') {
		return prefersDarkModeMql?.matches ? 'dark' : 'light';
	}

	return colorMode;
}

interface ThemeProviderProps {
	defaultColorMode: ColorMode;
	defaultTheme?: Partial<Theme>;
	children: React.ReactNode;
}

/**
 * __Theme provider__
 *
 * Provides global theming configuration.
 *
 * @internal
 */
export function ThemeProvider({
	children,
	defaultColorMode,
	defaultTheme: {
		dark = 'dark',
		light = 'light',
		spacing = 'spacing',
		typography,
		shape,
	} = defaultThemeSettings,
}: ThemeProviderProps) {
	const [chosenColorMode, setChosenColorMode] = useState<ColorMode>(defaultColorMode);
	const [reconciledColorMode, setReconciledColorMode] = useState<ReconciledColorMode>(
		getReconciledColorMode(defaultColorMode),
	);

	const [theme, setTheme] = useState<Theme>({
		dark,
		light,
		spacing,
		typography,
		shape,
	});

	const setColorMode = useCallback((colorMode: ColorMode) => {
		setChosenColorMode(colorMode);
		setReconciledColorMode(getReconciledColorMode(colorMode));
	}, []);

	const setPartialTheme = useCallback((nextTheme: Partial<Theme>) => {
		setTheme((theme) => ({ ...theme, ...nextTheme }));
	}, []);

	useEffect(() => {
		if (fg('platform_dst_fix_set_theme_race')) {
			return;
		}

		setGlobalTheme({
			...theme,
			colorMode: reconciledColorMode,
		});
	}, [theme, reconciledColorMode]);

	const lastSetGlobalThemePromiseRef = useRef<ReturnType<typeof setGlobalTheme> | null>(null);

	useEffect(() => {
		if (!fg('platform_dst_fix_set_theme_race')) {
			return;
		}

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
	}, [theme, reconciledColorMode]);

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

	return (
		<ColorModeContext.Provider value={reconciledColorMode}>
			<SetColorModeContext.Provider value={setColorMode}>
				<ThemeContext.Provider value={theme}>
					<SetThemeContext.Provider value={setPartialTheme}>{children}</SetThemeContext.Provider>
				</ThemeContext.Provider>
			</SetColorModeContext.Provider>
		</ColorModeContext.Provider>
	);
}

export default ThemeProvider;
