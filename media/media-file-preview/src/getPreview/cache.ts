import { type MediaStoreGetFileImageParams } from '@atlaskit/media-client';

import { type MediaFilePreview } from '../types';

import { createObjectURLCache, type ObjectURLCache } from './objectURLCache';

// Dimensions are used to create a key.
// Cache is invalidated when different dimensions are provided.
type Mode = MediaStoreGetFileImageParams['mode'] | undefined;

export const getCacheKey = (id: string, mode: Mode): string => {
	const resizeMode = mode || 'crop';
	return [id, resizeMode].join('-');
};

export interface MediaFilePreviewCache {
	get(id: string, mode: Mode): MediaFilePreview | undefined;
	set(id: string, mode: Mode, cardPreview: MediaFilePreview): void;
	remove(id: string, mode: Mode): void;
	clear(): void;
	acquire(id: string, mode: Mode): void;
	release(id: string, mode: Mode): void;
}

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

export const mediaFilePreviewCache: CardPreviewCacheImpl = new CardPreviewCacheImpl(createObjectURLCache());
