import { useContext, useEffect } from 'react';

import { SkipLinksContext } from './skip-links-context';
import { type SkipLinkContextProps, type SkipLinkData } from './types';

export const useSkipLinks = (): SkipLinkContextProps => useContext(SkipLinksContext);

export const useSkipLink = (
	id?: SkipLinkData['id'],
	skipLinkTitle?: SkipLinkData['skipLinkTitle'],
): void => {
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

export { SkipLinksContext } from './skip-links-context';
