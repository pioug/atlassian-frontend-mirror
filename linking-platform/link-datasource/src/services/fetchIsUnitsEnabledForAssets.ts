import { request } from '@atlaskit/linking-common/api';

import { type AssetsMultiSiteResponse } from '../types/assets/types';

const UNITS_ENABLED_TTL_MS = 15 * 60 * 1000;
const UNITS_ENABLED_ERROR_TTL_MS = 60 * 1000;

type CacheEntry = { expiresAt: number; promise: Promise<boolean> };

const cache = new Map<string, CacheEntry>();

const performFetch = async (cloudId: string): Promise<{ enabled: boolean; ttlMs: number }> => {
	try {
		const res = await request<AssetsMultiSiteResponse>(
			'get',
			'/assets/is-multi-site',
			undefined,
			{ 'x-atlassian-cloud-id': cloudId },
			[200],
		);
		return { enabled: res?.isUnitsEnabledForAssets === true, ttlMs: UNITS_ENABLED_TTL_MS };
	} catch {
		// Fail closed.
		return { enabled: false, ttlMs: UNITS_ENABLED_ERROR_TTL_MS };
	}
};

// Whether Units is enabled for Assets on this tenant. Single-flight and cached per
// cloudId (short TTL after a failure). Resolves false on any failure so callers fall
// back to the legacy current-site lookup.
export const fetchIsUnitsEnabledForAssets = (cloudId: string): Promise<boolean> => {
	const cached = cache.get(cloudId);
	if (cached && Date.now() < cached.expiresAt) {
		return cached.promise;
	}

	// Pending entries never expire, so concurrent callers share one request.
	const entry: CacheEntry = { expiresAt: Infinity, promise: Promise.resolve(false) };
	entry.promise = performFetch(cloudId).then(({ enabled, ttlMs }) => {
		entry.expiresAt = Date.now() + ttlMs;
		return enabled;
	});
	cache.set(cloudId, entry);
	return entry.promise;
};
