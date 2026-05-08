import { useEffect, useMemo, useState } from 'react';

import {
	getCurrentSiteCloudId,
	getCurrentSiteCloudIdSync,
} from '../../services/current-site-cloud-id';
import {
	getProviderPctMap,
	getProviderPctMapSync,
	SOCIAL_PROOF_TRAIT_NAME,
} from '../../services/personalization';
import type { ProviderPctMap } from '../../services/personalization/types';

export interface SocialProof {
	connectedPct: number | undefined;
	isEnabled: boolean;
	/** True while fetching personalization (only when `isEnabled`). */
	isLoading: boolean;
}

const NOT_ENABLED_RESULT: SocialProof = {
	connectedPct: undefined,
	isEnabled: false,
	isLoading: false,
};

/**
 * Cache-first social proof hook.
 *
 * On mount:
 * 1. Reads localStorage synchronously via `getProviderPctMapSync`.
 *    - If data exists (warm cache): sets `providerPctMap` immediately, `isLoading = false`.
 *    - If no data (cold cache): leaves `providerPctMap` undefined, `isLoading = false`.
 * 2. Always kicks off an async fetch (fire-and-forget) via `getProviderPctMap` to populate
 *    localStorage for next page load. Does NOT update state with the async result.
 *
 * This means:
 * - First page visit (cold): no social proof rendered, no experiment exposure fired.
 *   Background fetch populates localStorage for next time.
 * - Second page visit (warm): social proof renders immediately from localStorage.
 *   Background refresh keeps localStorage fresh.
 *
 * Callers decide separately (e.g. via Statsig experiment) whether to surface the data.
 */
const useSocialProof = (
	extensionKey?: string,
	isKillswitchOn = false,
	baseUriWithNoTrailingSlash = '',
): SocialProof => {
	const isEnabled = isKillswitchOn;

	const [snapshot] = useState<{
		cloudId: string | undefined;
		providerPctMap: ProviderPctMap | null;
	}>(() => {
		if (!isEnabled) {
			return { cloudId: undefined, providerPctMap: null };
		}

		const cloudId = getCurrentSiteCloudIdSync(baseUriWithNoTrailingSlash);
		return {
			cloudId,
			providerPctMap: getProviderPctMapSync(cloudId, SOCIAL_PROOF_TRAIT_NAME),
		};
	});

	// Fire-and-forget: warm caches for future mounts only. Never update this mount's treatment UI.
	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		void getCurrentSiteCloudId(baseUriWithNoTrailingSlash).then((cloudId) => {
			void getProviderPctMap(cloudId, SOCIAL_PROOF_TRAIT_NAME);
		});
	}, [baseUriWithNoTrailingSlash, isEnabled]);

	return useMemo(() => {
		if (!isEnabled) {
			return NOT_ENABLED_RESULT;
		}

		return {
			connectedPct:
				extensionKey && snapshot.providerPctMap ? snapshot.providerPctMap[extensionKey] : undefined,
			isEnabled: Boolean(snapshot.cloudId && snapshot.providerPctMap),
			isLoading: false, // sync read is instant; never in "loading" state
		};
	}, [extensionKey, isEnabled, snapshot]);
};

export default useSocialProof;
