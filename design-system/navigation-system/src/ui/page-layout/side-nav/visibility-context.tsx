import { createContext, type Dispatch, type SetStateAction } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import type { SideNavState } from './types';

/**
 * Context for the visibility of the side nav.
 * State is initialised as null. This is used when the value has not been set yet - which is important to know for SSR.
 */
export const SideNavVisibilityState = createContext<SideNavState | null>(null);

/**
 * Sets the visibility of the side nav.
 */
export const SetSideNavVisibilityState =
	createContext<Dispatch<SetStateAction<SideNavState | null>>>(__noop);
