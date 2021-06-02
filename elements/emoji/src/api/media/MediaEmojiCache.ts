import {
  EmojiDescription,
  OptionalEmojiDescription,
  EmojiRepresentation,
} from '../../types';
import {
  convertMediaToImageEmoji,
  isMediaRepresentation,
  isPromise,
} from '../../util/type-helpers';
import MediaImageLoader from './MediaImageLoader';
import debug from '../../util/logger';
import TokenManager from './TokenManager';

import { LRUCache } from 'lru-fast';

const getRequiredRepresentation = (
  emoji: EmojiDescription,
  useAlt?: boolean,
): EmojiRepresentation =>
  useAlt ? emoji.altRepresentation : emoji.representation;

const isUnsupportedBrowser = () => {
  const isIE = /*@cc_on!@*/ false || !!(document as any).documentMode; // Internet Explorer 6-11
  const isEdge = !isIE && !!(window as any).StyleMedia; // Edge 20+

  return isIE || isEdge;
};

export interface EmojiCacheStrategy {
  loadEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;
  optimisticRendering(): boolean;
}

/**
 * For browsers that support caching for resources
 * regardless of originally supplied headers (basically everything but Firefox).
 */
export class BrowserCacheStrategy implements EmojiCacheStrategy {
  private cachedImageUrls: Set<string> = new Set<string>();
  private mediaImageLoader: MediaImageLoader;

  constructor(mediaImageLoader: MediaImageLoader) {
    debug('BrowserCacheStrategy');
    this.mediaImageLoader = mediaImageLoader;
  }

  loadEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    const representation = getRequiredRepresentation(emoji, useAlt);

    if (!isMediaRepresentation(representation)) {
      return emoji;
    }

    const { mediaPath } = representation;

    if (this.cachedImageUrls.has(mediaPath)) {
      // Already cached
      return emoji;
    }

    return this.mediaImageLoader
      .loadMediaImage(mediaPath)
      .then(() => {
        // Media is loaded, can use original URL now, so just return original emoji
        this.cachedImageUrls.add(mediaPath);
        return emoji;
      })
      .catch(() => {
        return undefined;
      });
  }

  optimisticRendering() {
    return true;
  }

  static supported(
    mediaPath: string,
    mediaImageLoader: MediaImageLoader,
  ): Promise<boolean> {
    // IE/Edge uses memory cache strategy else images can fail to load
    // from a clean cache/if they are downloaded from the service
    // TODO: fix as a part of FS-1592
    if (isUnsupportedBrowser()) {
      return Promise.resolve(false);
    }

    return mediaImageLoader
      .loadMediaImage(mediaPath)
      .then(
        () =>
          // Image should be cached in browser, if supported it should be accessible from the cache by an <img/>
          // Try to load without via image to confirm this support (this fails in Firefox)
          new Promise<boolean>((resolve) => {
            const img = new Image();

            img.addEventListener('load', () => {
              resolve(true);
            });
            img.addEventListener('error', () => {
              resolve(false);
            });

            img.src = mediaPath;
          }),
      )
      .catch(() => false);
  }
}

const maxImageCached = 1000;
// Don't cache images large than this - dataUrl size in characters
const maxImageSize = 10000;

/**
 * For browsers that do no cache images without equivalent headers (e.g. Firefox).
 *
 * Images are cached in memory in a LRU cache. Images considered too large,
 * are not cached, but retrieved each time.
 *
 * Images are still cached by the browser, but loading in asynchronous with
 * small delay noticable to the end user.
 */
export class MemoryCacheStrategy implements EmojiCacheStrategy {
  private dataURLCache: LRUCache<string, string>;
  private mediaImageLoader: MediaImageLoader;

  constructor(mediaImageLoader: MediaImageLoader) {
    debug('MemoryCacheStrategy');
    this.mediaImageLoader = mediaImageLoader;
    this.dataURLCache = new LRUCache<string, string>(maxImageCached);
  }

  loadEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    const representation = getRequiredRepresentation(emoji, useAlt);

    if (!isMediaRepresentation(representation)) {
      return emoji;
    }

    const { mediaPath } = representation;
    const dataURL = this.dataURLCache.get(mediaPath);
    if (dataURL) {
      // Already cached
      return convertMediaToImageEmoji(emoji, dataURL, useAlt);
    }

    // Not cached, load
    return this.mediaImageLoader
      .loadMediaImage(mediaPath)
      .then((dataURL) => {
        const loadedEmoji = convertMediaToImageEmoji(emoji, dataURL, useAlt);
        if (dataURL.length <= maxImageSize) {
          // Only cache if not large than max size
          this.dataURLCache.put(mediaPath, dataURL);
        } else {
          debug(
            'No caching as image is too large',
            dataURL.length,
            dataURL.slice(0, 15),
            emoji.shortName,
          );
        }
        return loadedEmoji;
      })
      .catch(() => {
        return undefined;
      });
  }

  optimisticRendering() {
    return false;
  }
}

/**
 * Provides a cache for Media Emoji.
 *
 * Emoji are returned immediately if cached and ready to use by the browser.
 *
 * Otherwise, they are loaded and returned via a promise.
 */
export default class MediaEmojiCache {
  protected cache?: EmojiCacheStrategy;
  protected waitingInitUrls: string[] = [];
  private cacheLoading: Promise<EmojiCacheStrategy> | undefined;
  private mediaImageLoader: MediaImageLoader;

  constructor(tokenManager: TokenManager) {
    debug('MediaEmojiCache');
    this.mediaImageLoader = new MediaImageLoader(tokenManager);
  }

  loadEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    const representation = getRequiredRepresentation(emoji, useAlt);
    if (!isMediaRepresentation(representation)) {
      return emoji;
    }
    const { mediaPath } = representation;

    const emojiCache = this.getCache(mediaPath);

    if (isPromise(emojiCache)) {
      // Promise based
      return emojiCache
        .then((cache) => cache.loadEmoji(emoji, useAlt))
        .catch(() => undefined);
    }

    return emojiCache.loadEmoji(emoji, useAlt);
  }

  optimisticRendering(url: string): boolean | Promise<boolean> {
    const emojiCache = this.getCache(url);

    if (isPromise(emojiCache)) {
      // Promise based
      return emojiCache
        .then((cache) => cache.optimisticRendering())
        .catch(() => false);
    }

    return emojiCache.optimisticRendering();
  }

  protected getCache(
    url: string,
  ): EmojiCacheStrategy | Promise<EmojiCacheStrategy> {
    if (this.cache) {
      return this.cache;
    }
    this.waitingInitUrls.push(url);
    if (!this.cacheLoading) {
      this.cacheLoading = this.initCache()
        .then((cache) => {
          this.cache = cache;
          this.cacheLoading = undefined;
          return cache;
        })
        .catch((err) => {
          this.cacheLoading = undefined;
          throw err;
        });
    }
    return this.cacheLoading;
  }

  private initCache(): Promise<EmojiCacheStrategy> {
    const url = this.waitingInitUrls.pop();
    if (!url) {
      return Promise.reject(
        'Unable to initialise cache based on provided url(s)',
      );
    }
    return BrowserCacheStrategy.supported(url, this.mediaImageLoader)
      .then((supported) => {
        this.waitingInitUrls = []; // clear
        this.cacheLoading = undefined;
        if (supported) {
          return new BrowserCacheStrategy(this.mediaImageLoader);
        }
        return new MemoryCacheStrategy(this.mediaImageLoader);
      })
      .catch(() => {
        return this.initCache();
      });
  }
}
