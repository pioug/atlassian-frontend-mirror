import {
  createObjectURLCache,
  ObjectURLCache,
} from '../../../utils/objectURLCache';
import { CardDimensions } from '../../../utils/cardDimensions';
import { CardPreview } from './types';

// Dimensions are used to create a key.
// Cache is invalidated when different dimensions are provided.
export const getCacheKey = (id: string, dimensions: CardDimensions) => {
  return [id, dimensions.height, dimensions.width].join('-');
};

export interface CardPreviewCache {
  get(id: string, dimensions: CardDimensions): CardPreview | undefined;
  set(id: string, dimensions: CardDimensions, cardPreview: CardPreview): void;
}

export class CardPreviewCacheImpl implements CardPreviewCache {
  constructor(private previewCache: ObjectURLCache) {}

  get = (id: string, dimensions: CardDimensions): CardPreview | undefined => {
    const cacheKey = getCacheKey(id, dimensions);
    return this.previewCache.get(cacheKey);
  };

  set = (id: string, dimensions: CardDimensions, cardPreview: CardPreview) => {
    const cacheKey = getCacheKey(id, dimensions);
    this.previewCache.set(cacheKey, cardPreview);
  };
}

export default new CardPreviewCacheImpl(createObjectURLCache());
