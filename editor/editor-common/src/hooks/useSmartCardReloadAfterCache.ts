import { useEffect, useRef } from 'react';

import { useSmartLinkReload } from '@atlaskit/smart-card/hooks';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * Hook to manage smart card reload behavior when content is loaded from local cache.
 *
 * Handles:
 * - Capturing initial card status on mount (synchronously to avoid race conditions)
 * - Tracking URL changes and resetting state
 * - Only reloading data that was initially loaded from cache
 * - Ensuring reload is called at most once per URL
 * - Respecting page SSR state to avoid reloading on server-rendered pages
 *
 * @param url - The smart card URL
 * @param cardStatus - The current card resolution status ('pending', 'resolved', etc)
 * @param isPageSSRed - Whether the page was server-side rendered
 */
const useSmartCardReloadAfterCache = (
	url: string | undefined,
	cardStatus: string | undefined,
	isPageSSRed: boolean,
) => {
	const initialCardStatus = useRef<string | undefined>(undefined);
	const hasReloaded = useRef(false);
	const previousUrl = useRef<string | undefined>(url);
	const reload = useSmartLinkReload({ url: url || '' });

	// Reset refs when URL changes (do this before capturing initial status)
	if (previousUrl.current !== url) {
		initialCardStatus.current = undefined;
		hasReloaded.current = false;
		previousUrl.current = url;
	}

	// Capture initial card status on first render (synchronously)
	// This determines if the card was loaded from cache (resolved on mount)
	// or if it's being fetched fresh (pending on mount)
	if (
		expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true) &&
		cardStatus &&
		initialCardStatus.current === undefined
	) {
		initialCardStatus.current = cardStatus;
	}

	// Reload from cache in the background if needed
	useEffect(() => {
		if (
			expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true) &&
			!isPageSSRed &&
			url &&
			initialCardStatus.current === 'resolved' &&
			cardStatus === 'resolved' &&
			!hasReloaded.current
		) {
			hasReloaded.current = true;
			reload();
		}
	}, [isPageSSRed, url, cardStatus, reload]);
};

export default useSmartCardReloadAfterCache;
