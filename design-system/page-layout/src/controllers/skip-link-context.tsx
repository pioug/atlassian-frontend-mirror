import { createContext, useContext, useEffect } from 'react';

import noop from '@atlaskit/ds-lib/noop';

import { type SkipLinkContextProps, type SkipLinkData } from './types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SkipLinksContext = createContext<SkipLinkContextProps>({
	skipLinksData: [],
	registerSkipLink: noop,
	unregisterSkipLink: noop,
});

export const useSkipLinks = () => useContext(SkipLinksContext);

export const useSkipLink = (
	id?: SkipLinkData['id'],
	skipLinkTitle?: SkipLinkData['skipLinkTitle'],
) => {
	const { registerSkipLink, unregisterSkipLink } = useSkipLinks();
	useEffect(() => {
		if (id && skipLinkTitle) {
			registerSkipLink({ id, skipLinkTitle });
		}
		return () => {
			unregisterSkipLink(id);
		};
	}, [id, skipLinkTitle, registerSkipLink, unregisterSkipLink]);
};
