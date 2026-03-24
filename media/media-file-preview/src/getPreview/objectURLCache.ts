import { LRUMap } from 'lru_map';

import { fg } from '@atlaskit/platform-feature-flags';

import { type MediaFilePreview } from '../types';

export const PREVIEW_CACHE_LRU_SIZE = 50;

interface EvictionLRUCacheOptions<K, V> {
	/** Return false to prevent the oldest entry from being evicted (flag-gated). */
	shouldEvict?: (entry: [K, V]) => boolean;
	/** Called after an entry has been evicted via shift. */
	onEvict?: (entry: [K, V]) => void;
}

/**
 * LRU cache that checks whether the oldest entry should be evicted
 * this means that the cache can grow past the softLimit if `shouldEvict` returns false.
 *
 * When `platform_media_safe_blob_url_eviction` is ON the oldest
 * entry is kept if `shouldEvict` returns false.
 * When the flag is OFF the oldest entry is always evicted.
 */
class EvictionLRUCache<K, V> extends LRUMap<K, V> {
	private readonly shouldEvict?: (entry: [K, V]) => boolean;
	private readonly onEvict?: (entry: [K, V]) => void;

	constructor(softLimit: number, options?: EvictionLRUCacheOptions<K, V>) {
		super(softLimit);
		this.shouldEvict = options?.shouldEvict;
		this.onEvict = options?.onEvict;
	}

	shift(): [K, V] | undefined {
		if (fg('platform_media_safe_blob_url_eviction')) {
			const oldest = this.oldest;
			if (oldest && this.shouldEvict && !this.shouldEvict([oldest.key, oldest.value])) {
				return undefined;
			}
		}
		const entry = super.shift();
		if (entry && this.onEvict) {
			this.onEvict(entry);
		}
		return entry;
	}
}

export class ObjectURLCache {
	private readonly cache: LRUMap<string, MediaFilePreview>;
	private readonly activeRefs = new Map<string, number>();

	constructor(size: number) {
		this.cache = new EvictionLRUCache(size, {
			shouldEvict: (entry) => !this.isInUse(entry[0]),
			onEvict: (entry) => {
				if (entry[1].dataURI) {
					const dataURI = fg('platform_media_safe_blob_url_eviction')
						? entry[1].dataURI.split('#')[0]
						: entry[1].dataURI;
					if (dataURI) {
						URL.revokeObjectURL(dataURI);
					}
				}
			},
		});
	}

	/**
	 * Marks a cache key as actively in use by a consumer.
	 * Multiple consumers can acquire the same key; eviction is
	 * blocked until all consumers have released it.
	 */
	acquire(key: string): void {
		this.activeRefs.set(key, (this.activeRefs.get(key) ?? 0) + 1);
	}

	release(key: string): void {
		const count = this.activeRefs.get(key) ?? 0;
		if (count <= 1) {
			this.activeRefs.delete(key);
		} else {
			this.activeRefs.set(key, count - 1);
		}
	}

	private isInUse(key: string): boolean {
		return (this.activeRefs.get(key) ?? 0) > 0;
	}

	has(key: string): boolean {
		return !!this.cache.find(key);
	}

	get(key: string) {
		return this.cache.get(key);
	}

	set(key: string, value: MediaFilePreview): void {
		this.cache.set(key, value);
	}

	remove(key: string): void {
		const removed = this.cache.delete(key);
		this.activeRefs.delete(key);

		const dataURI = fg('platform_media_safe_blob_url_eviction')
			? removed?.dataURI.split('#')[0]
			: removed?.dataURI;
		dataURI && URL.revokeObjectURL(dataURI);
	}

	clear(): void {
		this.cache.clear();
	}
}

export const createObjectURLCache = () => new ObjectURLCache(PREVIEW_CACHE_LRU_SIZE);
