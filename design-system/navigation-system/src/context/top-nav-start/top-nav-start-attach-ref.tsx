import { createContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

export const TopNavStartAttachRef: import('react').Context<
	(newVal: HTMLDivElement | null) => void
> = createContext<(newVal: HTMLDivElement | null) => void>(__noop);
