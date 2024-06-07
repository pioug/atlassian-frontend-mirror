import { createObjectURLCache, PREVIEW_CACHE_LRU_SIZE } from './objectURLCache';

const revokeObjectURLSpy: jest.SpyInstance<
	void,
	Parameters<typeof URL.revokeObjectURL>
> = jest.spyOn(URL, 'revokeObjectURL');

describe('#getObjectUrlCache result', () => {
	beforeEach(() => {
		revokeObjectURLSpy.mockClear();
	});

	it('should keep PREVIEW_CACHE_LRU_SIZE amount of records', () => {
		const objectURLCache = createObjectURLCache();

		for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
			objectURLCache.set(`key${i + 1}`, {
				dataURI: `value-${i + 1}`,
				source: 'remote',
			});
		}

		for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
			expect(objectURLCache.has(`key${i + 1}`)).toEqual(true);
			expect(objectURLCache.get(`key${i + 1}`)).toEqual({
				dataURI: `value-${i + 1}`,
				source: 'remote',
			});
		}
	});

	it('should remove older records', () => {
		const objectURLCache = createObjectURLCache();

		objectURLCache.set('old-key', { dataURI: 'old-value', source: 'remote' });
		for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
			objectURLCache.set(`key${i + 1}`, {
				dataURI: `value-${i + 1}`,
				source: 'remote',
			});
		}

		expect(objectURLCache.has('old-key')).toEqual(false);
		expect(objectURLCache.get('old-key')).toEqual(undefined);
	});

	it('should revoke old objectURLs', () => {
		const objectURLCache = createObjectURLCache();

		objectURLCache.set('old-key', { dataURI: 'old-value', source: 'remote' });
		for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
			objectURLCache.set(`key${i + 1}`, {
				dataURI: `value-${i + 1}`,
				source: 'remote',
			});
		}
		expect(revokeObjectURLSpy).toHaveBeenCalledWith('old-value');
	});

	it('should return true when #has() called with a key of already added object', () => {
		const objectURLCache = createObjectURLCache();

		objectURLCache.set('key1', { dataURI: 'my-string', source: 'remote' });
		expect(objectURLCache.has('key1')).toEqual(true);
	});

	it('should return false when #has() called with a key of not yet added object', () => {
		const objectURLCache = createObjectURLCache();

		expect(objectURLCache.has('key2')).toEqual(false);
	});

	it('should return previously set object', () => {
		const objectURLCache = createObjectURLCache();

		objectURLCache.set('key1', { dataURI: 'my-string', source: 'remote' });
		expect(objectURLCache.get('key1')).toEqual({
			dataURI: 'my-string',
			source: 'remote',
		});
	});

	it('should remove & revoke a previously set object', () => {
		const objectURLCache = createObjectURLCache();
		objectURLCache.set('key1', { dataURI: 'my-string', source: 'remote' });
		objectURLCache.remove('key1');
		expect(objectURLCache.get('key1')).toBeUndefined();
		expect(revokeObjectURLSpy).toHaveBeenCalledWith('my-string');
	});
});
