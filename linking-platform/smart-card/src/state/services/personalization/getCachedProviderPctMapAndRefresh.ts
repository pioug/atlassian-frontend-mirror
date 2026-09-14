import { getCurrentSiteCloudId } from '../current-site-cloud-id/getCurrentSiteCloudId';
import { getCurrentSiteCloudIdSync } from '../current-site-cloud-id/getCurrentSiteCloudIdSync';
import { getProviderPctMap } from './getProviderPctMap';
import { getProviderPctMapSync } from './getProviderPctMapSync';
import type { ProviderPctMap } from './types';

/**
 * Backwards-compatible cache-first helper for inline-card social proof callers.
 *
 * Reads the persisted provider percentage map synchronously using the current site cloud id, then
 * starts a background refresh for subsequent mounts. The async result intentionally does not affect
 * the current call site, matching the warm-cache-only rendering contract.
 */
export function getCachedProviderPctMapAndRefresh(traitName: string): ProviderPctMap | null {
	const cloudId = getCurrentSiteCloudIdSync();
	const providerPctMap = getProviderPctMapSync(cloudId, traitName);

	void getCurrentSiteCloudId().then((resolvedCloudId) => {
		void getProviderPctMap(resolvedCloudId, traitName);
	});

	return providerPctMap;
}
