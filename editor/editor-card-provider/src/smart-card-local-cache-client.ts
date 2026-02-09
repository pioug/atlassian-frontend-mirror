import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

const SMART_CARD_CACHE_CLIENT_KEY = 'smart-card-url-data';
const SMART_CARD_CACHE_KEY = 'response-cache';
const SMART_CARD_CACHE_DEFAULT_MAX_ITEMS = 100;

type CacheEntry = {
	data: SmartLinkResponse;
	timestamp: number;
};

export class SmartCardLocalCacheClient {
	private readonly storageClient = new StorageClient(SMART_CARD_CACHE_CLIENT_KEY, {
		storageEngine: 'sessionStorage',
	});
	private maxItems: number;

	constructor(maxItems: number = SMART_CARD_CACHE_DEFAULT_MAX_ITEMS) {
		this.maxItems = maxItems;
	}

	/**
	 * Retrieves the entire cache object from storage
	 * @returns The entire cache object
	 */
	public getCache = (): Record<string, CacheEntry> => {
		const stored = this.storageClient.getItem(SMART_CARD_CACHE_KEY, { useExpiredItem: true });
		const persistentCache = stored ? (JSON.parse(stored) as Record<string, CacheEntry>) : {};
		return persistentCache;
	};

	/**
	 * Caches the SmartLinkResponse against the provided url in storage
	 * @param url The url (key) to store the response against
	 * @param response The SmartLinkResponse to be cached in storage
	 */
	public setItem = (url: string, response: SmartLinkResponse) => {
		const newCache = this.getCache();

		// Add or update the item in the cache with current timestamp
		newCache[url] = { data: response, timestamp: Date.now() };

		// Apply FIFO behavior if cache exceeds maxItems
		const cacheKeys = Object.keys(newCache);
		if (cacheKeys.length > this.maxItems) {
			// Sort keys by timestamp (oldest first) and remove the oldest items
			const sortedKeys = cacheKeys.sort((a, b) => newCache[a].timestamp - newCache[b].timestamp);
			const itemsToRemove = cacheKeys.length - this.maxItems;
			const keysToRemove = sortedKeys.slice(0, itemsToRemove);

			keysToRemove.forEach((key) => {
				delete newCache[key];
			});
		}

		this.storageClient.setItemWithExpiry(SMART_CARD_CACHE_KEY, JSON.stringify(newCache));
	};

	/**
	 * Retrieves the cached SmartLinkResponse for the provided url from storage (if it exists)
	 * @param url The url (key) to retrieve the cached response for
	 * @returns The cached SmartLinkResponse if it exists, else undefined
	 */
	public getItem = (url: string | undefined): SmartLinkResponse | undefined => {
		if (!url) {
			return;
		}

		const persistentCache = this.getCache();
		const response = persistentCache?.[url]?.data;
		return response;
	};

	/**
	 * Checks if a cached entry exists for the provided url in storage
	 * @param url The url (key) to check for existence in the cache
	 * @returns True if a cached entry exists, else false
	 */
	public isUrlInCache = (url: string): boolean => {
		const persistentCache = this.getCache();
		return persistentCache ? url in persistentCache : false;
	};
}
