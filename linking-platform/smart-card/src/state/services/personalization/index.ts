import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

import { getCurrentSiteCloudId, getCachedCurrentSiteCloudIdAndRefresh } from '../current-site-cloud-id';

import type { PersonalizationTrait, ProviderPctMap } from './types';

const BASE_URL = '/gateway/api/tap-delivery/api/v3/personalization';

/**
 * Logical key shape: `@atlaskit/smart-card:<feature>:<schema-version>:<scope>` (see smart-card
 * storage conventions). {@link StorageClient} narrows the localStorage key to
 * `<clientKey>_<itemKey>` with `clientKey === '@atlaskit/smart-card'` and
 * `itemKey === 'pct-map:v1:<cloudId>:<traitName>'` (scope segments URI-encoded).
 */
export const PERSONALIZATION_STORAGE_SCOPE: string = '@atlaskit/smart-card';

export const PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX: string = 'pct-map:v1:';

const smartCardStorage = new StorageClient(PERSONALIZATION_STORAGE_SCOPE);

/** Keys written by this service in localStorage when using {@link smartCardStorage}. */
const LOCAL_STORAGE_ROW_KEY_PREFIX = `${PERSONALIZATION_STORAGE_SCOPE}_${PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}`;

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

	/**
	 * Returns the currently cached provider percentage map synchronously and starts a background refresh.
	 * The refresh result is persisted for future calls but is not awaited by this call.
	 */
	getCachedProviderPctMapAndRefresh(traitName: string): ProviderPctMap | null {
		const cloudId = getCachedCurrentSiteCloudIdAndRefresh();
		const fromStorage = (cloudId && this.readStoredProviderPctMap(cloudId, traitName)) || null;
		void this.getProviderPctMap(traitName);
		return fromStorage;
	}

	async getProviderPctMap(traitName: string): Promise<ProviderPctMap | undefined> {
		const cachedPromise = this.cache.get(traitName);
		if (cachedPromise) {
			return cachedPromise;
		}

		const promise = (async (): Promise<ProviderPctMap | undefined> => {
			try {
				const cloudId = await getCurrentSiteCloudId();
				if (!cloudId) {
					return undefined;
				}
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

		this.cache.set(traitName, promise);
		return promise;
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
			smartCardStorage.setItemWithExpiry(pctMapStorageItemKey(cloudId, traitName), map);
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
		if (
			typeof globalThis.localStorage === 'undefined' ||
			globalThis.localStorage === null
		) {
			return;
		}

		const keysToRemove: string[] = [];
		for (
			let index = 0;
			index < globalThis.localStorage.length;
			index += 1
		) {
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

/**
 * Resolves the provider percentage map for a TAP Delivery trait through the module-level
 * {@link personalizationService}. Work is deduped per trait name for the page lifetime, and a
 * successful response is persisted by cloud id and trait name for later cached reads.
 */
export const getProviderPctMap: (traitName: string) => Promise<ProviderPctMap | undefined> = (
	traitName: string,
): Promise<ProviderPctMap | undefined> => personalizationService.getProviderPctMap(traitName);

/**
 * Reads the provider percentage map for a trait from browser storage via the module-level
 * {@link personalizationService} singleton, without awaiting network work.
 * Calling this also starts the trait-scoped shared refresh in the background, so a later call can
 * use a refreshed value when it becomes available.
 */
export function getCachedProviderPctMapAndRefresh(traitName: string): ProviderPctMap | null {
	return personalizationService.getCachedProviderPctMapAndRefresh(traitName);
}
