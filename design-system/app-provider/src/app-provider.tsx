import React, { createContext, useContext } from 'react';

import RouterLinkProvider, { type RouterLinkComponent } from './router-link-provider';
import ThemeProvider, { type ColorMode, type Theme } from './theme-provider';

const InsideAppProviderContext = createContext(false);
interface AppProviderProps {
	/**
	 * Initial color mode.
	 */
	defaultColorMode?: ColorMode;

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
function AppProvider({
	children,
	defaultColorMode = 'light',
	defaultTheme,
	routerLinkComponent,
	UNSAFE_isThemingDisabled,
}: AppProviderProps): React.JSX.Element {
	const isInsideAppProvider = useContext(InsideAppProviderContext);

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
				<ThemeProvider defaultColorMode={defaultColorMode} defaultTheme={defaultTheme}>
					{routerLinkProvider}
				</ThemeProvider>
			)}
		</InsideAppProviderContext.Provider>
	);
}

export default AppProvider;
