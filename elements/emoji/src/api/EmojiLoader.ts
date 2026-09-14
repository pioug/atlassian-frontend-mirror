import type { EmojiResponse } from '../types';
import { isTestEnvironment } from '../util/is-test-environment';
import type { EmojiLoaderConfig } from './EmojiUtils';
import { denormaliseEmojiServiceResponse } from './denormaliseEmojiServiceResponse';
import { emojiRequest } from './emojiRequest';

/**
 * Shared cache of in-flight/resolved emoji load promises, keyed by the request URL so that
 * multiple loaders created for the same provider config reuse a single request instead of
 * refetching.
 */
const emojiPromiseCache = new Map<string, Promise<EmojiResponse>>();

/**
 * Emoji providers should return JSON in the format defined by EmojiServiceResponse.
 */
export default class EmojiLoader {
	private config: EmojiLoaderConfig;

	constructor(config: EmojiLoaderConfig) {
		this.config = config;
	}

	/**
	 * Returns a promise with an array of Emoji from all providers.
	 */
	loadEmoji(): Promise<EmojiResponse> {
		// The cache is module-level and outlives individual loaders, so under test it would leak
		// responses between cases sharing a provider url. Always refetch there instead.
		if (isTestEnvironment()) {
			return this.fetchEmoji();
		}

		const cacheKey = this.config.url;
		const cachedPromise = emojiPromiseCache.get(cacheKey);
		if (cachedPromise) {
			return cachedPromise;
		}

		const emojiPromise = this.fetchEmoji();
		// Evict on failure so a rejected promise is not cached, allowing retries to refetch.
		emojiPromise.catch(() => {
			if (emojiPromiseCache.get(cacheKey) === emojiPromise) {
				emojiPromiseCache.delete(cacheKey);
			}
		});
		emojiPromiseCache.set(cacheKey, emojiPromise);
		return emojiPromise;
	}

	private fetchEmoji(): Promise<EmojiResponse> {
		return emojiRequest(this.config).then((emojiServiceResponse) =>
			denormaliseEmojiServiceResponse(emojiServiceResponse),
		);
	}
}
