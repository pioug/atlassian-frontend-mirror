import { ObjectURLCache } from '../../../../utils/objectURLCache';
import { CardPreviewCacheImpl, getCacheKey } from '../cache';
import { CardPreview } from '../';
const objectURLCache = {
  set: jest.fn(),
  get: jest.fn(),
};
const cache = new CardPreviewCacheImpl(
  (objectURLCache as unknown) as ObjectURLCache,
);

describe('CardPreviewCache', () => {
  beforeEach(() => {
    objectURLCache.get.mockClear();
    objectURLCache.set.mockClear();
  });

  it('should generate a cache key based on file id and requested dimensions', () => {
    const id = 'some-id';
    const newId = 'some-new-id';

    const dimensions = { width: '1px', height: '1px' };
    const sameDimensions = { width: '1px', height: '1px' };
    const newDimensions = { width: '2px', height: '2px' };

    const key = getCacheKey(id, dimensions);
    const sameKey = getCacheKey(id, sameDimensions);
    const newKeyIdChanged = getCacheKey(newId, dimensions);
    const newKeyDimChanged = getCacheKey(id, newDimensions);

    expect(key === sameKey).toBe(true);
    expect(key !== newKeyIdChanged).toBe(true);
    expect(key !== newKeyDimChanged).toBe(true);
  });

  it('should add a cardPreview to cache', () => {
    const id = 'some-id';
    const dimensions = { width: '1%', height: '1%' };

    const preview: CardPreview = {
      dataURI: 'i-am-a-card-preview',
      source: 'remote',
    };

    cache.set(id, dimensions, preview);

    const cacheKey = getCacheKey(id, dimensions);
    expect(objectURLCache.set).toBeCalledWith(cacheKey, preview);
  });

  it('should get a cardPreview from cache', () => {
    const expectedPreview = { dataURI: 'i-am-a-card-preview' };
    objectURLCache.get.mockReturnValueOnce(expectedPreview);

    const id = 'some-id';
    const dimensions = { width: '1%', height: '1%' };

    const preview = cache.get(id, dimensions);

    const cacheKey = getCacheKey(id, dimensions);
    expect(objectURLCache.get).toBeCalledWith(cacheKey);
    expect(preview).toBe(expectedPreview);
  });
});
