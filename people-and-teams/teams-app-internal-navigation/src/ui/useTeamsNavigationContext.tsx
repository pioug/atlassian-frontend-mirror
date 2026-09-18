import { useContext } from 'react';

import { type NavigationContext } from '../common/utils/getNavigationProps';
import { NavigationContextReact } from './NavigationContextReact';

/**
 * Read the current {@link NavigationContext} from the nearest {@link TeamsNavigationProvider}.
 *
 * When no provider is present, returns an empty object so link components can render without a wrapper.
 */
export function useTeamsNavigationContext(): NavigationContext {
	const context = useContext(NavigationContextReact);
	return context ?? {};
}
