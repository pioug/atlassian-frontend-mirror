import React, { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';

import { SkipLinksContext, type SkipLinksContextData } from './skip-links-context';
import { SkipLinksDataContext } from './skip-links-data-context';
import { type SkipLinkData } from './types';

const getByDomOrderSortFunction = () => {
	const layoutSlots = Array.from(document.querySelectorAll(`[data-layout-slot]`));
	return (a: SkipLinkData, b: SkipLinkData) => {
		const indexA = a.listIndex ?? layoutSlots.indexOf(document.getElementById(a.id)!);
		const indexB = b.listIndex ?? layoutSlots.indexOf(document.getElementById(b.id)!);

		/**
		 * If they are tied it is because one (or both) is
		 * a custom skiplink with a set index.
		 *
		 * Give the custom skiplink priority.
		 */
		if (indexA === indexB) {
			if (a.listIndex !== undefined) {
				return -1;
			} else {
				return 1;
			}
		}

		return indexA - indexB;
	};
};

/**
 * Provides a way to store and use skip links by combining SkipLinksContext and SkipLinksDataContext
 */
export const SkipLinksProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [links, setLinks] = useState<SkipLinkData[]>([]);
	const registerSkipLink = useCallback((skipLinkData: SkipLinkData) => {
		// Don't add duplicate skip links
		setLinks((oldLinks) => {
			if (oldLinks.some(({ id }) => id === skipLinkData.id)) {
				if (process.env.NODE_ENV !== 'production') {
					// eslint-disable-next-line no-console
					console.warn(
						`\
Tried registering duplicate skip link for ID '${skipLinkData.id}'.

If you're trying to override a slot skip link label, then use the \`skipLinkLabel\` prop instead.

This error will not be shown in production, and the duplicate skip link will be ignored.`,
					);
				}
				return oldLinks;
			}
			return [...oldLinks, skipLinkData].sort(getByDomOrderSortFunction());
		});
	}, []);

	const unregisterSkipLink = useCallback((id: string | undefined) => {
		setLinks((links) => links.filter((link) => link.id !== id));
	}, []);

	const contextValue = useMemo(() => {
		const data: SkipLinksContextData = {
			registerSkipLink,
			unregisterSkipLink,
		};
		return data;
	}, [registerSkipLink, unregisterSkipLink]);

	return (
		<SkipLinksContext.Provider value={contextValue}>
			<SkipLinksDataContext.Provider value={links}>{children}</SkipLinksDataContext.Provider>
		</SkipLinksContext.Provider>
	);
};
