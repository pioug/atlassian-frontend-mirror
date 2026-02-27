/**
 * In-memory session cache for sync block data with size-based LRU eviction.
 *
 * Backed by a plain Map so that potentially private ADF content is never
 * written to any browser-persistent storage (sessionStorage, localStorage,
 * IndexedDB). The module-level singleton survives SPA transitions (no full
 * page reload) and is naturally cleared on hard navigation or tab close.
 *
 * Uses JavaScript Map's insertion-order guarantee to implement LRU:
 * on every read or write the accessed entry is moved to the end of the
 * iteration order; when total cached size exceeds `maxSize`, the oldest
 * (least-recently-used) entries are evicted first.
 */
export class SyncBlockInMemorySessionCache {
	private store = new Map<string, string>();
	private currentSize = 0;

	/**
	 * Maximum total size of all cached values, measured in **UTF-16 code
	 * units** (i.e. `String.prototype.length`), not bytes.  For ASCII-only
	 * content the two are equivalent; for content with characters outside
	 * the BMP each surrogate pair counts as 2.
	 */
	private maxSize: number;

	constructor(maxSize: number = 5 * 1024 * 1024) {
		this.maxSize = maxSize;
	}

	/**
	 * Retrieves a cached value by key.
	 *
	 * **Side-effect:** promotes the entry to the most-recently-used
	 * position by re-inserting it at the end of the underlying Map's
	 * iteration order.
	 */
	getItem(key: string): string | null {
		const value = this.store.get(key);
		if (value === undefined) {
			return null;
		}
		this.store.delete(key);
		this.store.set(key, value);
		return value;
	}

	setItem(key: string, value: string): void {
		const existing = this.store.get(key);
		if (existing !== undefined) {
			this.currentSize -= existing.length;
			this.store.delete(key);
		}
		this.store.set(key, value);
		this.currentSize += value.length;
		while (this.currentSize > this.maxSize && this.store.size > 1) {
			const oldestKey = this.store.keys().next().value;
			if (oldestKey !== undefined) {
				const oldestValue = this.store.get(oldestKey);
				if (oldestValue !== undefined) {
					this.currentSize -= oldestValue.length;
				}
				this.store.delete(oldestKey);
			}
		}
	}

	removeItem(key: string): void {
		const value = this.store.get(key);
		if (value !== undefined) {
			this.currentSize -= value.length;
			this.store.delete(key);
		}
	}

	/**
	 * Removes all entries from the cache and resets the tracked size to zero.
	 * Useful for cleaning up the singleton on SPA navigation boundaries.
	 */
	clear(): void {
		this.store.clear();
		this.currentSize = 0;
	}
}

export const syncBlockInMemorySessionCache = new SyncBlockInMemorySessionCache();
