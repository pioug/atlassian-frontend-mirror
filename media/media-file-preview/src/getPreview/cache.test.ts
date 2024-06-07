import { type ImageResizeMode } from '@atlaskit/media-client';

import { type MediaFilePreview } from '../types';

import { CardPreviewCacheImpl, getCacheKey } from './cache';
import { type ObjectURLCache } from './objectURLCache';

const objectURLCache = {
	set: jest.fn(),
	get: jest.fn(),
	remove: jest.fn(),
};
const cache = new CardPreviewCacheImpl(objectURLCache as unknown as ObjectURLCache);

describe('CardPreviewCache', () => {
	beforeEach(() => {
		objectURLCache.get.mockClear();
		objectURLCache.set.mockClear();
	});

	it('should generate a cache key based on file id and requested dimensions', () => {
		const id = 'some-id';
		const newId = 'some-new-id';

		const mode: ImageResizeMode = 'fit';
		const newMode: ImageResizeMode = 'crop';

		const key = getCacheKey(id, mode);
		const sameKey = getCacheKey(id, mode);
		const newKeyIdChanged = getCacheKey(newId, mode);
		const newKeyModeChanged = getCacheKey(id, newMode);

		expect(key === sameKey).toBe(true);
		expect(key !== newKeyIdChanged).toBe(true);
		expect(key !== newKeyModeChanged).toBe(true);
	});

	it('should add a cardPreview to cache', () => {
		const id = 'some-id';
		const mode: ImageResizeMode = 'fit';

		const preview: MediaFilePreview = {
			dataURI: 'i-am-a-card-preview',
			source: 'remote',
		};

		cache.set(id, mode, preview);

		const cacheKey = getCacheKey(id, mode);
		expect(objectURLCache.set).toBeCalledWith(cacheKey, preview);
	});

	it('should get a cardPreview from cache', () => {
		const expectedPreview = { dataURI: 'i-am-a-card-preview' };
		objectURLCache.get.mockReturnValueOnce(expectedPreview);

		const id = 'some-id';
		const mode: ImageResizeMode = 'full-fit';

		const preview = cache.get(id, mode);

		const cacheKey = getCacheKey(id, mode);
		expect(objectURLCache.get).toBeCalledWith(cacheKey);
		expect(preview).toBe(expectedPreview);
	});

	it('should remove a cardPreview from cache', () => {
		const id = 'some-id';
		const mode: ImageResizeMode = 'crop';
		cache.remove(id, mode);

		const cacheKey = getCacheKey(id, mode);
		expect(objectURLCache.remove).toBeCalledWith(cacheKey);
	});
});
