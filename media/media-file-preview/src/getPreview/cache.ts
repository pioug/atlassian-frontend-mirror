import { MediaStoreGetFileImageParams } from '@atlaskit/media-client';

import { MediaFilePreview } from '../types';

import { createObjectURLCache, ObjectURLCache } from './objectURLCache';

// Dimensions are used to create a key.
// Cache is invalidated when different dimensions are provided.
type Mode = MediaStoreGetFileImageParams['mode'] | undefined;

export const getCacheKey = (id: string, mode: Mode) => {
  const resizeMode = mode || 'crop';
  return [id, resizeMode].join('-');
};

export interface MediaFilePreviewCache {
  get(id: string, mode: Mode): MediaFilePreview | undefined;
  set(id: string, mode: Mode, cardPreview: MediaFilePreview): void;
  remove(id: string, mode: Mode): void;
  clear(): void;
}

export class CardPreviewCacheImpl implements MediaFilePreviewCache {
  constructor(private previewCache: ObjectURLCache) {}

  get = (id: string, mode: Mode): MediaFilePreview | undefined => {
    const cacheKey = getCacheKey(id, mode);
    return this.previewCache.get(cacheKey);
  };

  set = (id: string, mode: Mode, cardPreview: MediaFilePreview) => {
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

export const mediaFilePreviewCache = new CardPreviewCacheImpl(
  createObjectURLCache(),
);
