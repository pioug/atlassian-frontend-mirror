import React, { type ReactNode, useCallback, useMemo, useState } from 'react';

import { SkipLinksContainer } from '../../components/skip-links/skip-links-container';

import { SkipLinksContext, type SkipLinksContextData } from './skip-links-context';
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
 * Provider for skip links. Should be rendered at the top level of the application.
 *
 * - Provides the context to register/unregister skip links
 * - Renders the skip links container
 */
export function SkipLinksProvider({
	children,
	label,
	testId,
}: {
	children: ReactNode;
	label: string;
	testId?: string;
}): React.JSX.Element {
	const [links, setLinks] = useState<Array<SkipLinkData>>([]);
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
			<SkipLinksContainer label={label} testId={testId} links={links} />
			{children}
		</SkipLinksContext.Provider>
	);
}
