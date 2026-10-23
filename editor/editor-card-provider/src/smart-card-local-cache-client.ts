import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

const SMART_CARD_CACHE_DEFAULT_MAX_ITEMS = 100;

type CacheEntry = {
	data: SmartLinkResponse;
	timestamp: number;
};

/**
 * Singleton cache client for smart link responses shared within the current document.
 */
export class SmartCardLocalCacheClient {
	private static instance: SmartCardLocalCacheClient | null = null;

	private maxItems: number;
	private documentCache: Record<string, CacheEntry> = {};

	private constructor(maxItems: number = SMART_CARD_CACHE_DEFAULT_MAX_ITEMS) {
		this.maxItems = maxItems;
	}

	/**
	 * Gets the singleton instance of SmartCardLocalCacheClient.
	 * This ensures all callers share the same in-memory cache.
	 * @param maxItems Maximum number of items to store in the cache (only used on first instantiation)
	 * @returns The singleton instance
	 */
	public static getInstance(
		maxItems: number = SMART_CARD_CACHE_DEFAULT_MAX_ITEMS,
	): SmartCardLocalCacheClient {
		if (!SmartCardLocalCacheClient.instance) {
			SmartCardLocalCacheClient.instance = new SmartCardLocalCacheClient(maxItems);
		}
		return SmartCardLocalCacheClient.instance;
	}

	/**
	 * Resets the singleton instance. Only intended for testing purposes.
	 * @internal
	 */
	public static resetInstance(): void {
		SmartCardLocalCacheClient.instance = null;
	}

	/**
	 * Retrieves the entire cache object from memory
	 * @returns The entire cache object
	 */
	public getCache = (): Record<string, CacheEntry> => {
		return this.documentCache;
	};

	/**
	 * Caches the SmartLinkResponse against the provided url
	 * @param url The url (key) to store the response against
	 * @param response The SmartLinkResponse to be cached
	 */
	public setItem = (url: string, response: SmartLinkResponse): void => {
		this.documentCache[url] = { data: response, timestamp: Date.now() };
		const cacheKeys = Object.keys(this.documentCache);
		if (cacheKeys.length > this.maxItems) {
			const sortedKeys = cacheKeys.sort(
				(a, b) => this.documentCache[a].timestamp - this.documentCache[b].timestamp,
			);
			const itemsToRemove = cacheKeys.length - this.maxItems;
			const keysToRemove = sortedKeys.slice(0, itemsToRemove);
			keysToRemove.forEach((key) => {
				delete this.documentCache[key];
			});
		}
	};

	/**
	 * Retrieves the cached SmartLinkResponse for the provided url (if it exists)
	 * @param url The url (key) to retrieve the cached response for
	 * @returns The cached SmartLinkResponse if it exists, else undefined
	 */
	public getItem = (url: string | undefined): SmartLinkResponse | undefined => {
		if (!url) {
			return;
		}

		return this.documentCache[url]?.data;
	};

	/**
	 * Checks if a cached entry exists for the provided url
	 * @param url The url (key) to check for existence in the cache
	 * @returns True if a cached entry exists, else false
	 */
	public isUrlInCache = (url: string): boolean => {
		return url in this.documentCache;
	};
}
