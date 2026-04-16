import { createContext, type Dispatch, type SetStateAction } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import type { SideNavState } from './types';

export const SetSideNavVisibilityState: import('react').Context<
	Dispatch<SetStateAction<SideNavState | null>>
> = createContext<Dispatch<SetStateAction<SideNavState | null>>>(__noop);
