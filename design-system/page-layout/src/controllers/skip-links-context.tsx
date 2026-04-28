import { type Context, createContext } from 'react';

import noop from '@atlaskit/ds-lib/noop';

import { type SkipLinkContextProps } from './types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SkipLinksContext: Context<SkipLinkContextProps> = createContext<SkipLinkContextProps>({
	skipLinksData: [],
	registerSkipLink: noop,
	unregisterSkipLink: noop,
});
