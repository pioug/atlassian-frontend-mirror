import { useContext, useEffect } from 'react';

import { SkipLinksContext } from './skip-links-context';
import { type SkipLinkData } from './types';

/**
 * Internal-only hook for registering skip links.
 *
 * `useSkipLink` is the public API wrapper of this.
 *
 * This private version exists for us to support `onBeforeNavigate` / `navigate` for the side nav use case,
 * where we might need to expand it before moving focus, without having to support those publicly.
 */
export const useSkipLinkInternal: ({
	id,
	label,
	listIndex,
	onBeforeNavigate,
	navigate,
	isHidden,
}: SkipLinkData) => void = ({
	id,
	label,
	listIndex,
	onBeforeNavigate,
	navigate,
	isHidden,
}: SkipLinkData): void => {
	const { registerSkipLink, unregisterSkipLink } = useContext(SkipLinksContext);
	useEffect(() => {
		if (isHidden) {
			/**
			 * Skip links are hidden for slots with 0 height or width.
			 * They should not be registered.
			 */
			return;
		}

		registerSkipLink({ id, label, listIndex, onBeforeNavigate, navigate, isHidden });
		return () => {
			unregisterSkipLink(id);
		};
	}, [id, isHidden, label, listIndex, onBeforeNavigate, navigate, registerSkipLink, unregisterSkipLink]);
};
