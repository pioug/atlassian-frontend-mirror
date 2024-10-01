import { useMemo } from 'react';
import uuid from 'uuid';

import { useSmartCardActions as useLinkActions } from '../actions';
import { useSmartLinkAnalytics as useLinkAnalytics } from '../analytics';

export interface UseSmartLinkReloadOpts {
	/**
	 * Smart Link URL for which the reload will be invoked.
	 * @example https://start.atlassian.com
	 */
	url: string;
}

/**
 * Exposes a programmatic way to reload the data being used to render a Smart Link.
 * @param
 * @returns
 */
export function useSmartLinkReload({ url }: UseSmartLinkReloadOpts) {
	const id: string = useMemo(() => uuid(), []);

	const linkAnalytics = useLinkAnalytics(url, id);
	const linkActions = useLinkActions(id, url, linkAnalytics);

	return linkActions.reload;
}
