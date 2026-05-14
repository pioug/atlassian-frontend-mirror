/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { type SkipLinkData, useSkipLinks } from '../../controllers';

/**
 * __useCustomSkipLink__
 *
 * @deprecated `@atlaskit/page-layout` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export const useCustomSkipLink = (
	id: SkipLinkData['id'],
	skipLinkTitle: SkipLinkData['skipLinkTitle'],
	listIndex: SkipLinkData['listIndex'] = 0,
): void => {
	const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

	useEffect(() => {
		registerSkipLink({ id, skipLinkTitle, listIndex });
		return () => {
			unregisterSkipLink(id);
		};
	}, [id, listIndex, skipLinkTitle, registerSkipLink, unregisterSkipLink]);
};
