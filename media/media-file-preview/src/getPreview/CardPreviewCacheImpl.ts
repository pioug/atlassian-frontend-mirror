import { type MediaFilePreview } from '../types';

import type { ObjectURLCache } from './ObjectURLCache-2';
import type { MediaFilePreviewCache, Mode } from './cache';
import { getCacheKey } from './getCacheKey';

export class CardPreviewCacheImpl implements MediaFilePreviewCache {
	constructor(private previewCache: ObjectURLCache) {}

	get = (id: string, mode: Mode): MediaFilePreview | undefined => {
		const cacheKey = getCacheKey(id, mode);
		return this.previewCache.get(cacheKey);
	};

	set = (id: string, mode: Mode, cardPreview: MediaFilePreview): void => {
		const cacheKey = getCacheKey(id, mode);
		this.previewCache.set(cacheKey, cardPreview);
	};

	remove = (id: string, mode: Mode): void => {
		const cacheKey = getCacheKey(id, mode);
		this.previewCache.remove(cacheKey);
	};

	clear = (): void => {
		this.previewCache.clear();
	};

	acquire = (id: string, mode: Mode): void => {
		const cacheKey = getCacheKey(id, mode);
		this.previewCache.acquire(cacheKey);
	};

	release = (id: string, mode: Mode): void => {
		const cacheKey = getCacheKey(id, mode);
		this.previewCache.release(cacheKey);
	};
}
