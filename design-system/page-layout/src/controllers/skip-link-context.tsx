import { useEffect } from 'react';

import { type SkipLinkData } from './types';
import { useSkipLinks } from './use-skip-links';

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
