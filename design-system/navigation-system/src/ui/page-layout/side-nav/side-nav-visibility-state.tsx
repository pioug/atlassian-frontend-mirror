import { createContext } from 'react';

import type { SideNavState } from './types';

/**
 * Context for the visibility of the side nav.
 * State is initialised as null. This is used when the value has not been set yet - which is important to know for SSR.
 */
export const SideNavVisibilityState: import('react').Context<SideNavState | null> =
	createContext<SideNavState | null>(null);
