import type { EmojiDescription, OptionalEmojiDescription } from '../../types';
import { isMediaRepresentation } from '../../util/is-media-representation';
import { isPromise } from '../../util/is-promise';
import debug from '../../util/logger';
import { BrowserCacheStrategy } from './BrowserCacheStrategy';
import { getRequiredRepresentation } from './getRequiredRepresentation';
import MediaImageLoader from './MediaImageLoader';
import { MemoryCacheStrategy } from './MemoryCacheStrategy';
import type TokenManager from './TokenManager';

export interface EmojiCacheStrategy {
	loadEmoji(
		emoji: EmojiDescription,
		useAlt?: boolean,
	): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;
	optimisticRendering(): boolean;
}

export const maxImageCached: any = 1000;

// Don't cache images large than this - dataUrl size in characters
export const maxImageSize: any = 10000;

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
			return emojiCache.then((cache) => cache.loadEmoji(emoji, useAlt)).catch(() => undefined);
		}

		return emojiCache.loadEmoji(emoji, useAlt);
	}

	optimisticRendering(url: string): boolean | Promise<boolean> {
		const emojiCache = this.getCache(url);

		if (isPromise(emojiCache)) {
			// Promise based
			return emojiCache.then((cache) => cache.optimisticRendering()).catch(() => false);
		}

		return emojiCache.optimisticRendering();
	}

	protected getCache(url: string): EmojiCacheStrategy | Promise<EmojiCacheStrategy> {
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
			return Promise.reject('Unable to initialise cache based on provided url(s)');
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
