import {
  createObjectURLCache,
  PREVIEW_CACHE_LRU_SIZE,
} from '../../objectURLCache';
import { expectToEqual } from '@atlaskit/media-test-helpers';

describe('#getObjectUrlCache result', () => {
  const setup = () => {
    const objectURLCache = createObjectURLCache();
    const revokeObjectURLSpy: jest.SpyInstance<
      void,
      Parameters<typeof URL.revokeObjectURL>
    > = jest.spyOn(URL, 'revokeObjectURL');

    return { objectURLCache, revokeObjectURLSpy };
  };

  it('should keep PREVIEW_CACHE_LRU_SIZE amount of records', () => {
    const { objectURLCache } = setup();

    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      objectURLCache.set(`key${i + 1}`, { dataURI: `value-${i + 1}` });
    }

    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      expectToEqual(objectURLCache.has(`key${i + 1}`), true);
      expectToEqual(objectURLCache.get(`key${i + 1}`), {
        dataURI: `value-${i + 1}`,
      });
    }
  });

  it('should remove older records', () => {
    const { objectURLCache } = setup();

    objectURLCache.set('old-key', { dataURI: 'old-value' });
    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      objectURLCache.set(`key${i + 1}`, { dataURI: `value-${i + 1}` });
    }

    expectToEqual(objectURLCache.has('old-key'), false);
    expectToEqual(objectURLCache.get('old-key'), undefined);
  });

  it('should revoke old objectURLs', () => {
    const { objectURLCache, revokeObjectURLSpy } = setup();

    objectURLCache.set('old-key', { dataURI: 'old-value' });
    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      objectURLCache.set(`key${i + 1}`, { dataURI: `value-${i + 1}` });
    }
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('old-value');
  });

  it('should return true when #has() called with a key of already added object', () => {
    const { objectURLCache } = setup();

    objectURLCache.set('key1', { dataURI: 'my-string' });
    expectToEqual(objectURLCache.has('key1'), true);
  });

  it('should return false when #has() called with a key of not yet added object', () => {
    const { objectURLCache } = setup();

    expectToEqual(objectURLCache.has('key2'), false);
  });

  it('should return previously set object', () => {
    const { objectURLCache } = setup();

    objectURLCache.set('key1', { dataURI: 'my-string' });
    expectToEqual(objectURLCache.get('key1'), { dataURI: 'my-string' });
  });
});
