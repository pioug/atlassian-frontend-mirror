import { LRUMap } from 'lru_map';

import type { EmojiDescription, OptionalEmojiDescription } from '../../types';
import { convertMediaToImageEmoji } from '../../util/convert-media-to-image-emoji';
import { isMediaRepresentation } from '../../util/is-media-representation';
import debug from '../../util/logger';
import { maxImageCached, maxImageSize } from './MediaEmojiCache';
import type { EmojiCacheStrategy } from './MediaEmojiCache';
import type MediaImageLoader from './MediaImageLoader';
import { getRequiredRepresentation } from './getRequiredRepresentation';

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
	private dataURLCache: LRUMap<string, string>;
	private mediaImageLoader: MediaImageLoader;

	constructor(mediaImageLoader: MediaImageLoader) {
		debug('MemoryCacheStrategy');
		this.mediaImageLoader = mediaImageLoader;
		this.dataURLCache = new LRUMap<string, string>(maxImageCached);
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
					this.dataURLCache.set(mediaPath, dataURL);
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
