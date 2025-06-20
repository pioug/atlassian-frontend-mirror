import { createContext, useContext, useEffect } from 'react';

import noop from '@atlaskit/ds-lib/noop';

import { type SkipLinkData } from './types';

export type SkipLinksContextData = {
	registerSkipLink: (skipLinkData: SkipLinkData) => void;
	unregisterSkipLink: (id: string | undefined) => void;
};

/**
 * Provides a way to register and unregister skip links
 */
export const SkipLinksContext = createContext<SkipLinksContextData>({
	registerSkipLink: noop,
	unregisterSkipLink: noop,
});

const useSkipLinks = () => useContext(SkipLinksContext);

/**
 * Internal-only hook for registering skip links.
 *
 * `useSkipLink` is the public API wrapper of this.
 *
 * This private version exists for us to support `onBeforeNavigate` for the side nav use case,
 * where we might need to expand it before moving focus, without having to support `onBeforeNavigate` publicly.
 */
export const useSkipLinkInternal = ({
	id,
	label,
	listIndex,
	onBeforeNavigate,
	isHidden,
}: SkipLinkData) => {
	const { registerSkipLink, unregisterSkipLink } = useSkipLinks();
	useEffect(() => {
		if (isHidden) {
			/**
			 * Skip links are hidden for slots with 0 height or width.
			 * They should not be registered.
			 */
			return;
		}

		registerSkipLink({ id, label, listIndex, onBeforeNavigate, isHidden });
		return () => {
			unregisterSkipLink(id);
		};
	}, [id, isHidden, label, listIndex, onBeforeNavigate, registerSkipLink, unregisterSkipLink]);
};

/**
 * Call `useSkipLink` to register a skip link for important elements on the page.
 */
export const useSkipLink = (
	/**
	 * The unique ID for the skip link.
	 * You can use the `useSkipLinkId` hook to generate a unique ID.
	 */
	id: string,
	/**
	 * The label for the skip link.
	 */
	label: string,
	/**
	 * You can optionally set the position of the skip link in the list of skip links.
	 * Positions are zero-indexed.
	 */
	listIndex?: number,
) => {
	useSkipLinkInternal({ id, label, listIndex });
};
