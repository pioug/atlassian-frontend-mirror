import { type ImageResizeMode } from '@atlaskit/media-client';
import { createObjectURLCache, type ObjectURLCache } from '../../utils/objectURLCache';
import { type CardPreview } from '../../types';

// Dimensions are used to create a key.
// Cache is invalidated when different dimensions are provided.
type Mode = ImageResizeMode | undefined;

export const getCacheKey = (id: string, mode: Mode) => {
	const resizeMode = mode || 'crop';
	return [id, resizeMode].join('-');
};

export interface CardPreviewCache {
	get(id: string, mode: Mode): CardPreview | undefined;
	set(id: string, mode: Mode, cardPreview: CardPreview): void;
	remove(id: string, mode: Mode): void;
	clear(): void;
}

export class CardPreviewCacheImpl implements CardPreviewCache {
	constructor(private previewCache: ObjectURLCache) {}

	get = (id: string, mode: Mode): CardPreview | undefined => {
		const cacheKey = getCacheKey(id, mode);
		return this.previewCache.get(cacheKey);
	};

	set = (id: string, mode: Mode, cardPreview: CardPreview) => {
		const cacheKey = getCacheKey(id, mode);
		this.previewCache.set(cacheKey, cardPreview);
	};

	remove = (id: string, mode: Mode) => {
		const cacheKey = getCacheKey(id, mode);
		this.previewCache.remove(cacheKey);
	};

	clear = () => {
		this.previewCache.clear();
	};
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CardPreviewCacheImpl(createObjectURLCache());
