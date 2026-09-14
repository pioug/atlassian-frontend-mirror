import React from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens/theme-color-modes';

import { AppProviderThemingEnabledContext } from './app-provider-theming-enabled-context';
import { InsideAppProviderContext } from './inside-app-provider-context';
import RouterLinkProvider, { type RouterLinkComponent } from './router-link-provider';
import { useScrollbarHarmonisation } from './scrollbar-harmonisation/use-scrollbar-harmonisation';
import { ThemeProvider } from './theme-provider';
import { type Theme } from './theme-provider/context/theme';
import { useIsInsideAppProvider } from './use-is-inside-app-provider';

interface AppProviderProps {
	/**
	 * Initial color mode.
	 */
	defaultColorMode?: ThemeColorModes;

	/**
	 * Theme settings.
	 */
	defaultTheme?: Partial<Theme>;

	/**
	 * A configured router link component.
	 */
	routerLinkComponent?: RouterLinkComponent<any>;

	/**
	 * Disables theming functionality.
	 * This is intended for use in apps with existing
	 * theming configuration that want to incrementally
	 * adopt AppProvider.
	 *
	 * @warning Use with caution. This prop will be removed in a future release.
	 */
	UNSAFE_isThemingDisabled?: boolean;

	/**
	 * App content.
	 */
	children: React.ReactNode;
}

/**
 * __App provider__
 *
 * An app provider provides app level configuration such as global theming.
 *
 * Place it at the root of your application.
 */
export function AppProvider({
	children,
	defaultColorMode = 'light',
	defaultTheme,
	routerLinkComponent,
	UNSAFE_isThemingDisabled,
}: AppProviderProps): React.JSX.Element {
	const isInsideAppProvider = useIsInsideAppProvider();
	useScrollbarHarmonisation();

	if (isInsideAppProvider) {
		throw new Error('App provider should not be nested within another app provider.');
	}

	const routerLinkProvider = (
		<RouterLinkProvider routerLinkComponent={routerLinkComponent}>{children}</RouterLinkProvider>
	);

	return (
		<InsideAppProviderContext.Provider value={true}>
			{UNSAFE_isThemingDisabled ? (
				routerLinkProvider
			) : (
				<AppProviderThemingEnabledContext.Provider value={true}>
					<ThemeProvider defaultColorMode={defaultColorMode} defaultTheme={defaultTheme}>
						{routerLinkProvider}
					</ThemeProvider>
				</AppProviderThemingEnabledContext.Provider>
			)}
		</InsideAppProviderContext.Provider>
	);
}

/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { AppProvider } from '@atlaskit/app-provider/app-provider'` instead.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports -- VOLTC-139 tracks removal of this deprecated default export shim.
export default AppProvider;
