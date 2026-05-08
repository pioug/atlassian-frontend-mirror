import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

import { getCurrentSiteCloudId, getCurrentSiteCloudIdSync } from '../current-site-cloud-id';

import type { PersonalizationTrait, ProviderPctMap } from './types';

const BASE_URL = '/gateway/api/tap-delivery/api/v3/personalization';

export const PERSONALIZATION_STORAGE_SCOPE = 'smart-card-social-proof';
export const PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX = 'pct-map:v1:';
export const PERSONALIZATION_PROVIDER_PCT_TTL_MS: number = 24 * 60 * 60 * 1000;
export const SOCIAL_PROOF_TRAIT_NAME = 'sl_3p_connected_providers_site_pct';

const smartCardStorage = new StorageClient(PERSONALIZATION_STORAGE_SCOPE);

/** Keys written by this service in localStorage when using {@link smartCardStorage}. */
const LOCAL_STORAGE_ROW_KEY_PREFIX = `${PERSONALIZATION_STORAGE_SCOPE}_${PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}`;

function scopedCacheKey(cloudId: string, traitName: string): string {
	return `${cloudId}:${traitName}`;
}

function pctMapStorageItemKey(cloudId: string, traitName: string): string {
	return `${PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(cloudId)}:${encodeURIComponent(
		traitName,
	)}`;
}

async function fetchSiteTraits(cloudId: string): Promise<PersonalizationTrait[]> {
	const response = await fetch(`${BASE_URL}/site/${cloudId}`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		return [];
	}

	const data = await response.json();
	return data?.attributes ?? [];
}

/**
 * Service for fetching site-level traits from the TAP Delivery personalization API.
 */
export class PersonalizationService {
	private cache = new Map<string, Promise<ProviderPctMap | undefined>>();

	/** Pure synchronous read for an explicit cloud id / trait pair. */
	getProviderPctMapSync(cloudId: string | undefined, traitName: string): ProviderPctMap | null {
		if (!cloudId) {
			return null;
		}
		return this.readStoredProviderPctMap(cloudId, traitName);
	}

	async getProviderPctMap(
		cloudId: string | undefined,
		traitName: string,
	): Promise<ProviderPctMap | undefined> {
		if (!cloudId) {
			return undefined;
		}

		const cacheKey = scopedCacheKey(cloudId, traitName);
		const cachedPromise = this.cache.get(cacheKey);
		if (cachedPromise) {
			return cachedPromise;
		}

		const promise = (async (): Promise<ProviderPctMap | undefined> => {
			try {
				const traits = await fetchSiteTraits(cloudId);
				const trait = traits.find((t) => t.name === traitName);
				const mapped = this.parseTraitValue(trait?.value);
				if (mapped !== undefined) {
					this.writeStoredProviderPctMap(cloudId, traitName, mapped);
				}
				return mapped;
			} catch {
				return undefined;
			}
		})();

		const retryablePromise = promise.finally(() => {
			this.cache.delete(cacheKey);
		});

		this.cache.set(cacheKey, retryablePromise);
		return retryablePromise;
	}

	private readStoredProviderPctMap(cloudId: string, traitName: string): ProviderPctMap | null {
		try {
			const stored = smartCardStorage.getItem(pctMapStorageItemKey(cloudId, traitName));
			if (stored === undefined || stored === null) {
				return null;
			}
			return this.normalizeProviderPctMap(stored);
		} catch {
			return null;
		}
	}

	private writeStoredProviderPctMap(cloudId: string, traitName: string, map: ProviderPctMap): void {
		try {
			smartCardStorage.setItemWithExpiry(
				pctMapStorageItemKey(cloudId, traitName),
				map,
				PERSONALIZATION_PROVIDER_PCT_TTL_MS,
			);
		} catch {
			// Quota, private-mode, etc.
		}
	}

	private normalizeProviderPctMap(value: unknown): ProviderPctMap | null {
		if (typeof value !== 'object' || value === null || Array.isArray(value)) {
			return null;
		}

		const map: ProviderPctMap = {};
		const entries = Object.entries(value);

		for (const [providerKey, percentageRaw] of entries) {
			if (typeof percentageRaw !== 'number' || !Number.isFinite(percentageRaw)) {
				return null;
			}
			map[providerKey] = percentageRaw;
		}

		return map;
	}

	private parseTraitValue(raw: string | boolean | number | undefined): ProviderPctMap | undefined {
		if (typeof raw !== 'string') {
			return undefined;
		}
		try {
			const parsed = JSON.parse(raw);
			const normalized = this.normalizeProviderPctMap(parsed);
			return normalized === null ? undefined : normalized;
		} catch {
			return undefined;
		}
	}

	clearCache(): void {
		this.cache.clear();
		this.clearStoredProviderPctMaps();
	}

	private clearStoredProviderPctMaps(): void {
		if (typeof globalThis.localStorage === 'undefined' || globalThis.localStorage === null) {
			return;
		}

		const keysToRemove: string[] = [];
		for (let index = 0; index < globalThis.localStorage.length; index += 1) {
			const key = globalThis.localStorage.key(index);
			if (key !== null && key.startsWith(LOCAL_STORAGE_ROW_KEY_PREFIX)) {
				keysToRemove.push(key);
			}
		}
		for (const key of keysToRemove) {
			try {
				globalThis.localStorage.removeItem(key);
			} catch {
				/* ignore */
			}
		}
	}
}

export const personalizationService: PersonalizationService = new PersonalizationService();

export const getProviderPctMap = (
	cloudId: string | undefined,
	traitName: string,
): Promise<ProviderPctMap | undefined> =>
	personalizationService.getProviderPctMap(cloudId, traitName);

export function getProviderPctMapSync(
	cloudId: string | undefined,
	traitName: string,
): ProviderPctMap | null {
	return personalizationService.getProviderPctMapSync(cloudId, traitName);
}

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
