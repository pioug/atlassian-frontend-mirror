import {
  objectURLCache,
  PREVIEW_CACHE_LRU_SIZE,
} from '../../card/objectURLCache';
import { expectToEqual } from '@atlaskit/media-test-helpers';

describe('#getObjectUrlCache result', () => {
  let revokeObjectURLSpy: jest.SpyInstance<
    void,
    Parameters<typeof URL.revokeObjectURL>
  >;

  beforeEach(() => {
    revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    objectURLCache.reset();
  });

  it('should keep PREVIEW_CACHE_LRU_SIZE amount of records', () => {
    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      objectURLCache.set(`key${i + 1}`, `value-${i + 1}`);
    }

    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      expectToEqual(objectURLCache.has(`key${i + 1}`), true);
      expectToEqual(objectURLCache.get(`key${i + 1}`), `value-${i + 1}`);
    }
  });

  it('should remove older records', () => {
    objectURLCache.set('old-key', 'old-value');
    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      objectURLCache.set(`key${i + 1}`, `value-${i + 1}`);
    }

    expectToEqual(objectURLCache.has('old-key'), false);
  });

  it('should revoke old objectURLs', () => {
    objectURLCache.set('old-key', 'old-value');
    for (let i = 0; i < PREVIEW_CACHE_LRU_SIZE; i++) {
      objectURLCache.set(`key${i + 1}`, `value-${i + 1}`);
    }
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('old-value');
  });

  it('should return true when #has() called with a key of already added object', () => {
    objectURLCache.set('key1', 'my-string');
    expectToEqual(objectURLCache.has('key1'), true);
  });

  it('should return false when #has() called with a key of not yet added object', () => {
    expectToEqual(objectURLCache.has('key2'), false);
  });

  it('should return previously set object', () => {
    objectURLCache.set('key1', 'my-string');
    expectToEqual(objectURLCache.get('key1'), 'my-string');
  });

  it('should clear all object when #reset() is called', () => {
    objectURLCache.set('key1', 'my-string-1');
    objectURLCache.set('key2', 'my-string-2');

    objectURLCache.reset();

    expectToEqual(objectURLCache.has('key1'), false);
    expectToEqual(objectURLCache.has('key2'), false);
  });
});
