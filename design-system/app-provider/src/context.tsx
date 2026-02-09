import { createContext, useContext } from 'react';

/**
 * __Inside app provider context__
 *
 * A context that indicates if the current component is inside an AppProvider.
 */
export const InsideAppProviderContext: import("react").Context<boolean> = createContext(false);

export const useIsInsideAppProvider: () => boolean = () => {
	return useContext(InsideAppProviderContext);
};

/**
 * __App provider theming enabled context__
 *
 * A context that indicates if the AppProvider is enabled for theming.
 */
export const AppProviderThemingEnabledContext: import("react").Context<boolean> = createContext(false);

export const useIsAppProviderThemingEnabled: () => boolean = () => {
	return useContext(AppProviderThemingEnabledContext);
};

