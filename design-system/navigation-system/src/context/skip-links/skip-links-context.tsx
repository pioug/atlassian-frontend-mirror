import { createContext } from 'react';

import noop from '@atlaskit/ds-lib/noop';

import { type SkipLinkData } from './types';

export type SkipLinksContextData = {
	registerSkipLink: (skipLinkData: SkipLinkData) => void;
	unregisterSkipLink: (id: string | undefined) => void;
};

/**
 * Provides a way to register and unregister skip links
 */
export const SkipLinksContext: import('react').Context<SkipLinksContextData> =
	createContext<SkipLinksContextData>({
		registerSkipLink: noop,
		unregisterSkipLink: noop,
	});
