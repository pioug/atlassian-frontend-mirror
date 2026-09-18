/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React, { useContext, useMemo, type ReactNode } from 'react';

import { type NavigationContext } from '../common/utils/getNavigationProps';
import { NavigationContextReact } from './NavigationContextReact';

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
 * @deprecated Use `import { useTeamsNavigationContext } from '@atlaskit/teams-app-internal-navigation/use-teams-navigation-context'` instead.
 */
export { useTeamsNavigationContext } from './useTeamsNavigationContext';
