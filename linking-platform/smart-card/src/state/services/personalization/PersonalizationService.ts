import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';

import { personalizationConstants } from './constants';
import type { PersonalizationTrait, ProviderPctMap } from './types';

const smartCardStorage = new StorageClient(personalizationConstants.PERSONALIZATION_STORAGE_SCOPE);

/** Keys written by this service in localStorage when using {@link smartCardStorage}. */
const LOCAL_STORAGE_ROW_KEY_PREFIX = `${personalizationConstants.PERSONALIZATION_STORAGE_SCOPE}_${personalizationConstants.PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}`;

function scopedCacheKey(cloudId: string, traitName: string): string {
	return `${cloudId}:${traitName}`;
}

function pctMapStorageItemKey(cloudId: string, traitName: string): string {
	return `${personalizationConstants.PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(cloudId)}:${encodeURIComponent(
		traitName,
	)}`;
}

async function fetchSiteTraits(cloudId: string): Promise<PersonalizationTrait[]> {
	const response = await fetch(`${personalizationConstants.BASE_URL}/site/${cloudId}`, {
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
				personalizationConstants.PERSONALIZATION_PROVIDER_PCT_TTL_MS,
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
		// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
		if (typeof globalThis.localStorage === 'undefined' || globalThis.localStorage === null) {
			return;
		}

		const keysToRemove: string[] = [];
		// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
		for (let index = 0; index < globalThis.localStorage.length; index += 1) {
			// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
			const key = globalThis.localStorage.key(index);
			if (key !== null && key.startsWith(LOCAL_STORAGE_ROW_KEY_PREFIX)) {
				keysToRemove.push(key);
			}
		}
		for (const key of keysToRemove) {
			try {
				// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
				globalThis.localStorage.removeItem(key);
			} catch {
				/* ignore */
			}
		}
	}
}
