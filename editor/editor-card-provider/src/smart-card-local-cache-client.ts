import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

const SMART_CARD_CACHE_CLIENT_KEY = 'smart-card-url-data';
const SMART_CARD_CACHE_KEY = 'response-cache';
const SMART_CARD_CACHE_DEFAULT_MAX_ITEMS = 100;

type CacheEntry = {
	data: SmartLinkResponse;
	timestamp: number;
};

/**
 * Singleton cache client for smart link responses. Uses sessionStorage for per-tab isolation (no cross-tab conflicts).
 * If switching to localStorage for cross-tab sharing, add a 'storage' event listener in the constructor to sync
 * memoryCache when other tabs modify the cache, preventing race conditions from concurrent writes.
 */
export class SmartCardLocalCacheClient {
	private static instance: SmartCardLocalCacheClient | null = null;

	private readonly storageClient = new StorageClient(SMART_CARD_CACHE_CLIENT_KEY, {
		storageEngine: 'sessionStorage',
	});
	private maxItems: number;
	private memoryCache: Record<string, CacheEntry>;
	private pendingWrite: boolean = false;

	private constructor(maxItems: number = SMART_CARD_CACHE_DEFAULT_MAX_ITEMS) {
		this.maxItems = maxItems;
		// Load cache from storage into memory on instantiation
		const stored = this.storageClient.getItem(SMART_CARD_CACHE_KEY, { useExpiredItem: true });
		this.memoryCache = stored ? (JSON.parse(stored) as Record<string, CacheEntry>) : {};
	}

	/**
	 * Gets the singleton instance of SmartCardLocalCacheClient.
	 * This ensures all callers share the same in-memory cache and prevents
	 * race conditions when multiple instances write to the same storage key.
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
		return this.memoryCache;
	};

	/**
	 * Caches the SmartLinkResponse against the provided url in storage
	 * @param url The url (key) to store the response against
	 * @param response The SmartLinkResponse to be cached in storage
	 */
	public setItem = (url: string, response: SmartLinkResponse) => {
		// Add or update the item in the cache with current timestamp
		this.memoryCache[url] = { data: response, timestamp: Date.now() };

		// Apply FIFO behavior if cache exceeds maxItems
		const cacheKeys = Object.keys(this.memoryCache);
		if (cacheKeys.length > this.maxItems) {
			// Sort keys by timestamp (oldest first) and remove the oldest items
			const sortedKeys = cacheKeys.sort(
				(a, b) => this.memoryCache[a].timestamp - this.memoryCache[b].timestamp,
			);
			const itemsToRemove = cacheKeys.length - this.maxItems;
			const keysToRemove = sortedKeys.slice(0, itemsToRemove);

			keysToRemove.forEach((key) => {
				delete this.memoryCache[key];
			});
		}

		// Write through to storage asynchronously (non-blocking)
		// Debounced to batch multiple rapid calls into a single write
		if (!this.pendingWrite) {
			this.pendingWrite = true;
			queueMicrotask(() => {
				try {
					this.storageClient.setItemWithExpiry(
						SMART_CARD_CACHE_KEY,
						JSON.stringify(this.memoryCache),
					);
				} catch (_) {
					// Ignore storage write errors (e.g. quota exceeded) to prevent blocking future writes
					// Cache will still function in-memory for the session, but won't persist
				} finally {
					this.pendingWrite = false;
				}
			});
		}
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

		const response = this.memoryCache?.[url]?.data;
		return response;
	};

	/**
	 * Checks if a cached entry exists for the provided url in storage
	 * @param url The url (key) to check for existence in the cache
	 * @returns True if a cached entry exists, else false
	 */
	public isUrlInCache = (url: string): boolean => {
		return url in this.memoryCache;
	};
}
