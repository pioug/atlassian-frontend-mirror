import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

import { type NavigationContext } from '../common/utils/getNavigationProps';

const NavigationContextReact = createContext<NavigationContext | undefined>(undefined);

export interface TeamsNavigationProviderProps {
	value: NavigationContext;
	children: ReactNode;
}

/**
 * Provider for Teams internal navigation context.
 *
 * Supplies a {@link NavigationContext} to all descendant Teams navigation
 * components. When providers are nested, the closest ancestor with a valid
 * `contextEntryPoint` is used.
 */
export function TeamsNavigationProvider({
	value,
	children,
}: TeamsNavigationProviderProps): React.JSX.Element {
	const ancestorEntryPoint = useContext(NavigationContextReact)?.contextEntryPoint;

	const contextValue = useMemo<NavigationContext>(
		() =>
			!value.contextEntryPoint && ancestorEntryPoint
				? { ...value, contextEntryPoint: ancestorEntryPoint }
				: value,
		[ancestorEntryPoint, value],
	);

	return (
		<NavigationContextReact.Provider value={contextValue}>
			{children}
		</NavigationContextReact.Provider>
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
