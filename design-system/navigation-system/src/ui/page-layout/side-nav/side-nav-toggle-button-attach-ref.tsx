import { createContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

export const SideNavToggleButtonAttachRef: import('react').Context<
	(newVal: HTMLButtonElement | null) => void
> = createContext<(newVal: HTMLButtonElement | null) => void>(__noop);
