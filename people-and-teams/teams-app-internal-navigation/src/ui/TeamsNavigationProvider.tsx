import React, { createContext, useContext, type ReactNode } from 'react';

import type { NavigationContext } from '../common/utils/getNavigationProps';

const NavigationContextReact = createContext<NavigationContext | undefined>(undefined);

export interface TeamsNavigationProviderProps {
	value: NavigationContext;
	children: ReactNode;
}

/**
 * Provider for Teams internal navigation context.
 *
 * This is a thin wrapper around the headless {@link NavigationContext}. It should not implement any logic beyond providing values to hooks.
 */
export function TeamsNavigationProvider({
	value,
	children,
}: TeamsNavigationProviderProps): React.JSX.Element {
	return (
		<NavigationContextReact.Provider value={value}>{children}</NavigationContextReact.Provider>
	);
}

/**
 * Read the current {@link NavigationContext} from the nearest {@link TeamsNavigationProvider}.
 *
 * Throws an error when no provider is present.
 */
export function useTeamsNavigationContext(): NavigationContext {
	const context = useContext(NavigationContextReact);
	if (!context) {
		throw new Error('useTeamsNavigationContext must be used within a TeamsNavigationProvider');
	}
	return context;
}
