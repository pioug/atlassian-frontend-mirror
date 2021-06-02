import { waitUntil } from '@atlaskit/elements-test-helpers';
import * as sinon from 'sinon';
import MediaEmojiCache, {
  BrowserCacheStrategy,
  EmojiCacheStrategy,
  MemoryCacheStrategy,
} from '../../../../api/media/MediaEmojiCache';
import MediaImageLoader from '../../../../api/media/MediaImageLoader';
import TokenManager from '../../../../api/media/TokenManager';
import { frequentCategory } from '../../../../util/constants';
import { isPromise } from '../../../../util/type-helpers';
import { EmojiDescriptionWithVariations } from '../../../../types';
import {
  createTokenManager,
  imageEmoji,
  loadedAltMediaEmoji,
  loadedMediaEmoji,
  mediaEmoji,
  mediaEmojiImagePath,
} from '../../_test-data';

const restoreStub = (stub: any) => {
  if (stub.restore) {
    stub.restore();
  }
};

class MockMediaImageLoader extends MediaImageLoader {
  reject: boolean = false;
  constructor() {
    super(createTokenManager());
  }

  loadMediaImage(_url: string): Promise<string> {
    if (this.reject) {
      return Promise.reject('Bad times');
    }
    return Promise.resolve(`data:;base64,`);
  }
}

describe('MediaEmojiCache', () => {
  class TestMediaEmojiCache extends MediaEmojiCache {
    constructor(tokenManager?: TokenManager) {
      super(tokenManager || createTokenManager());
    }

    callGetCache(
      url: string,
    ): EmojiCacheStrategy | Promise<EmojiCacheStrategy> {
      return this.getCache(url);
    }
  }

  afterEach(() => {
    restoreStub(BrowserCacheStrategy.supported);
    restoreStub(BrowserCacheStrategy.prototype.loadEmoji);
    restoreStub(BrowserCacheStrategy.prototype.optimisticRendering);
    restoreStub(MemoryCacheStrategy.prototype.loadEmoji);
    restoreStub(MemoryCacheStrategy.prototype.optimisticRendering);
  });

  describe('#getCache', () => {
    it('init - use BrowserCacheStrategy', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy.then((implCache) => {
          expect(implCache instanceof BrowserCacheStrategy).toEqual(true);
        });
      }
      expect(false).toEqual(true);
      return;
    });

    it('init - use MemoryCacheStrategy', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(false));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy.then((implCache) => {
          expect(implCache instanceof MemoryCacheStrategy).toEqual(true);
        });
      }
      expect(false).toEqual(true);
      return;
    });

    it('cache initialised - returns cache not promise', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy.then((implCache) => {
          expect(implCache instanceof BrowserCacheStrategy).toEqual(true);
          const cacheStrategy2 = cache.callGetCache(mediaEmojiImagePath);
          expect(isPromise(cacheStrategy2)).toEqual(false);
        });
      }
      expect(false).toEqual(true);
      return;
    });

    it('init - first url is bad, good second', () => {
      const supportedError = 'damn it';
      const supportedStub = sinon.stub(BrowserCacheStrategy, 'supported');
      supportedStub.onFirstCall().returns(Promise.reject(supportedError));
      supportedStub.onSecondCall().returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy
          .catch((err) => {
            expect(err).toEqual(
              'Unable to initialise cache based on provided url(s)',
            );

            const cacheStrategy2 = cache.callGetCache(mediaEmojiImagePath);
            if (isPromise(cacheStrategy)) {
              return cacheStrategy2 as Promise<EmojiCacheStrategy>;
            }
            expect(false).toEqual(true);
            return Promise.reject('unreachable');
          })
          .then((implCache) => {
            expect(implCache instanceof BrowserCacheStrategy).toEqual(true);
          });
      }
      expect(false).toEqual(true);
      return;
    });
  });

  describe('#loadEmoji', () => {
    it('image emoji - immediately returned', () => {
      const cache = new TestMediaEmojiCache();
      const loadedEmoji = cache.loadEmoji(imageEmoji);
      expect(isPromise(loadedEmoji)).toEqual(false);
      expect(loadedEmoji).toEqual(imageEmoji);
    });

    it('media emoji - before and after cache ready', () => {
      sinon
        .stub(BrowserCacheStrategy.prototype, 'loadEmoji')
        .returns(loadedMediaEmoji);
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const emojiPromise = cache.loadEmoji(mediaEmoji);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(loadedMediaEmoji);
          const cachedEmoji = cache.loadEmoji(mediaEmoji);
          if (isPromise(cachedEmoji)) {
            expect(false);
            return;
          }
          expect(cachedEmoji).toEqual(loadedMediaEmoji);
        });
      }
      expect(false).toEqual(true);
      return;
    });

    it('media emoji - cache failed to load', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.reject('fail'));
      const cache = new TestMediaEmojiCache();
      const emojiPromise = cache.loadEmoji(mediaEmoji);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(undefined);
        });
      }
      expect(false).toEqual(true);
      return;
    });
  });

  describe('#optimisticRendering', () => {
    it('delegates to cache strategy', () => {
      const optimisticRenderingStub = sinon.stub(
        BrowserCacheStrategy.prototype,
        'optimisticRendering',
      );
      optimisticRenderingStub.returns(true);
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const optimisticRenderingPromise = cache.optimisticRendering(
        mediaEmojiImagePath,
      );
      if (isPromise(optimisticRenderingPromise)) {
        return optimisticRenderingPromise.then((optimistic) => {
          expect(optimistic).toEqual(true);
          expect(optimisticRenderingStub.callCount).toEqual(1);
          const optimisticRendering = cache.optimisticRendering(
            mediaEmojiImagePath,
          );
          if (isPromise(optimisticRendering)) {
            expect(false);
            return;
          }
          expect(optimisticRendering).toEqual(true);
          expect(optimisticRenderingStub.callCount).toEqual(2);
        });
      }
      expect(false).toEqual(true);
      return;
    });

    it('returns false if no cache strategy', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.reject('fail'));
      const cache = new TestMediaEmojiCache();
      const renderingPromise = cache.optimisticRendering(mediaEmojiImagePath);
      if (isPromise(renderingPromise)) {
        return renderingPromise.then((optimistic) => {
          expect(optimistic).toEqual(false);
        });
      }
      expect(false).toEqual(true);
      return;
    });
  });
});

describe('BrowserCacheStrategy', () => {
  describe('#supported', () => {
    class MockImage {
      src!: string;
      listeners: Map<string, Function> = new Map();
      addEventListener(type: string, callback: Function) {
        this.listeners.set(type, callback);
      }
    }
    let imageConstructorStub: sinon.SinonStub;
    let mockImage: MockImage;
    let mockMediaImageLoader: MediaImageLoader;

    beforeEach(() => {
      mockImage = new MockImage();
      mockMediaImageLoader = new MockMediaImageLoader();
      imageConstructorStub = sinon
        .stub(window, 'Image' as any)
        .returns(mockImage);
    });

    afterEach(() => {
      restoreStub(Image);
    });

    it('image loaded', () => {
      const promise = BrowserCacheStrategy.supported(
        'cheese',
        mockMediaImageLoader,
      ).then((supported) => {
        expect(supported).toEqual(true);
        expect(mockImage.src).toEqual('cheese');
      });
      return waitUntil(() => !!mockImage.listeners.get('load')).then(() => {
        mockImage.listeners.get('load')!();
        return promise;
      });
    });

    it('image load error', () => {
      const promise = BrowserCacheStrategy.supported(
        'cheese',
        mockMediaImageLoader,
      ).then((supported) => {
        expect(supported).toEqual(false);
        expect(mockImage.src).toEqual('cheese');
      });
      return waitUntil(() => !!mockImage.listeners.get('error')).then(() => {
        mockImage.listeners.get('error')!();
        return promise;
      });
    });

    it('exception loading image', () => {
      restoreStub(imageConstructorStub);
      imageConstructorStub = sinon
        .stub(window, 'Image' as any)
        .throws(new Error('doh'));
      return BrowserCacheStrategy.supported(
        'cheese',
        mockMediaImageLoader,
      ).then((supported) => {
        expect(supported).toEqual(false);
        expect(mockImage.src).toEqual(undefined);
        expect(mockImage.listeners.size).toEqual(0);
      });
    });
  });

  describe('#loadEmoji', () => {
    let mockMediaImageLoader: MockMediaImageLoader;
    let browserCacheStrategy: BrowserCacheStrategy;

    beforeEach(() => {
      mockMediaImageLoader = new MockMediaImageLoader();
      browserCacheStrategy = new BrowserCacheStrategy(mockMediaImageLoader);
    });

    it('returns emoji if not media', () => {
      const emoji = browserCacheStrategy.loadEmoji(imageEmoji);
      expect(isPromise(emoji)).toEqual(false);
      expect(emoji).toEqual(imageEmoji);
    });

    it('returns Promise if uncached, Emoji when not', () => {
      const emojiPromise = browserCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(emoji);
          const cachedEmoji = browserCacheStrategy.loadEmoji(mediaEmoji);
          expect(isPromise(cachedEmoji)).toEqual(false);
          expect(cachedEmoji).toEqual(emoji);
        });
      }
      return;
    });

    it('returns undefined via Promise if uncached and error', () => {
      mockMediaImageLoader.reject = true;
      const emojiPromise = browserCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(undefined);
        });
      }
      return;
    });

    it('returns different emoji if two different EmojiDescription have same mediaPath', () => {
      const frequentEmoji: EmojiDescriptionWithVariations = {
        ...mediaEmoji,
        category: frequentCategory,
      };
      const emojiPromise = browserCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(emoji);
          const cachedEmoji = browserCacheStrategy.loadEmoji(frequentEmoji);
          expect(isPromise(cachedEmoji)).toEqual(false);
          expect(cachedEmoji).toEqual(frequentEmoji);
        });
      }
      return;
    });
  });
});

describe('MemoryCacheStrategy', () => {
  describe('#loadEmoji', () => {
    let mockMediaImageLoader: MockMediaImageLoader;
    let memoryCacheStrategy: MemoryCacheStrategy;

    beforeEach(() => {
      mockMediaImageLoader = new MockMediaImageLoader();
      memoryCacheStrategy = new MemoryCacheStrategy(mockMediaImageLoader);
    });

    it('returns emoji if not media', () => {
      const emoji = memoryCacheStrategy.loadEmoji(imageEmoji);
      expect(isPromise(emoji)).toEqual(false);
      expect(emoji).toEqual(imageEmoji);
    });

    it('returns Promise if uncached, Emoji when not', () => {
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(loadedMediaEmoji);
          const cachedEmoji = memoryCacheStrategy.loadEmoji(mediaEmoji);
          expect(isPromise(cachedEmoji)).toEqual(false);
          expect(cachedEmoji).toEqual(loadedMediaEmoji);
        });
      }
      return;
    });

    it('returns undefined via Promise if uncached and error, Emoji once cached', () => {
      mockMediaImageLoader.reject = true;
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(undefined);
        });
      }
      return;
    });

    it('returns dataURL for altRepresentation.imgPath when useAlt is passed in', () => {
      const useAlt = true;
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji, useAlt);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          // loadedAltMediaEmoji has dataURL generated for and set in
          // altRepresentation.imgPath rather than representation.imgPath
          expect(emoji).toEqual(loadedAltMediaEmoji);
          const cachedEmoji = memoryCacheStrategy.loadEmoji(mediaEmoji, useAlt);
          expect(isPromise(cachedEmoji)).toEqual(false);
          expect(cachedEmoji).toEqual(loadedAltMediaEmoji);
        });
      }
      return;
    });

    it('returns different emoji if two different EmojiDescription have same mediaPath', () => {
      const frequentEmoji: EmojiDescriptionWithVariations = {
        ...mediaEmoji,
        category: frequentCategory,
      };
      const loadedFrequentEmoji: EmojiDescriptionWithVariations = {
        ...loadedMediaEmoji,
        category: frequentCategory,
      };
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise)).toEqual(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then((emoji) => {
          expect(emoji).toEqual(loadedMediaEmoji);
          const cachedEmoji = memoryCacheStrategy.loadEmoji(frequentEmoji);
          expect(isPromise(cachedEmoji)).toEqual(false);
          expect(cachedEmoji).toEqual(loadedFrequentEmoji);
        });
      }
      return;
    });
  });
});
