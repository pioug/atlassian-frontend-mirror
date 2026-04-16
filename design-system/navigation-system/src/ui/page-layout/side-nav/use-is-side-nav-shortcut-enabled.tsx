import { useContext } from 'react';

import { IsSideNavShortcutEnabledContext } from './is-side-nav-shortcut-enabled-context';

/**
 * Returns the value of the `isSideNavShortcutEnabled` prop from the `Root` component, which
 * is shared through context.
 */
export function useIsSideNavShortcutEnabled(): boolean {
	return useContext(IsSideNavShortcutEnabledContext);
}
