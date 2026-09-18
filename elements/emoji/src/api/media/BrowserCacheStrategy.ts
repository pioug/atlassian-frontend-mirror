import type { EmojiDescription, OptionalEmojiDescription } from '../../types';
import { isMediaRepresentation } from '../../util/is-media-representation';
import debug from '../../util/logger';
import { getRequiredRepresentation } from './getRequiredRepresentation';
import type { EmojiCacheStrategy } from './MediaEmojiCache';
import type MediaImageLoader from './MediaImageLoader';

const isUnsupportedBrowser = () => {
	const isIE = /*@cc_on!@*/ false || !!(document as any).documentMode; // Internet Explorer 6-11
	const isEdge = !isIE && !!(window as any).StyleMedia; // Edge 20+

	return isIE || isEdge;
};

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

	static supported(mediaPath: string, mediaImageLoader: MediaImageLoader): Promise<boolean> {
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
