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
	private maxSize: number;

	constructor(maxSize: number = 5 * 1024 * 1024) {
		this.maxSize = maxSize;
	}

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
}

export const syncBlockInMemorySessionCache = new SyncBlockInMemorySessionCache();
