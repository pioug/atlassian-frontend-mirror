import type { EmojiDescription } from '../../types';
import DuplicateLimitedQueue from '../../util/DuplicateLimitedQueue';
import StoredDuplicateLimitedQueue from '../../util/StoredDuplicateLimitedQueue';
import { localStoragePrefix } from '../../util/constants';
import { isEmojiVariationDescription } from '../../util/is-emoji-variation-description';
import storageAvailable from '../../util/storage-available';
import { Gateway } from './Gateway';

/**
 * Keeps track of the last 150 emoji usages, although limiting the maximum count for a single emoji to 25 to
 * ensure we don't end up with only a single emoji being recorded. Usage is persisted to local storage for
 * consistency between 'sessions'.
 *
 * Skin tone variations for an emoji will be 'collapsed' so they are tracked as their base emoji. Gender
 * variations are not collapsed in this way and will be tracked per gender. This decision reflects the UI of
 * the EmojiPicker component.
 */
export class UsageFrequencyTracker {
	private static readonly queueOptions = {
		// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
		storage: storageAvailable('localStorage') ? window.localStorage : undefined,
		storagePrefix: localStoragePrefix,
		maxDuplicates: 25,
		minUniqueItems: 5,
	};

	protected queue: DuplicateLimitedQueue<string>;
	private gateway: Gateway;

	constructor(useStorageIfPossible = true) {
		const options = UsageFrequencyTracker.queueOptions;
		if (useStorageIfPossible && options.storage) {
			const queueOptions = {
				...options,
				storage: options.storage as Storage,
			};

			this.queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
		} else {
			this.queue = new DuplicateLimitedQueue<string>(options);
		}

		this.gateway = new Gateway(10);
	}

	/**
	 * Record the fact that the supplied emoji was used. You should note that usage is updated asynchronously so you can not
	 * count on getOrder() reflecting this usage immediately.
	 *
	 * @param emoji the emoji who's usage is to be recorded. If the emoji has no id then no usage will be recorded
	 */
	recordUsage(emoji: EmojiDescription): void {
		let emojiId = emoji.id;
		if (emojiId) {
			if (isEmojiVariationDescription(emoji)) {
				emojiId = emoji.baseId;
			}

			this.gateway.submit(() => {
				if (emojiId) {
					this.queue.enqueue(emojiId);
				}
			});
		}
	}

	/**
	 * Returns an array of emoji id (without skin tone variations) sorted by most used to least used. If there
	 * are no usages then an empty array will be returned.
	 */
	getOrder(): Array<string> {
		return this.queue.getItemsOrderedByDuplicateCount();
	}

	/**
	 * Exposed for testing only. Clear any recorded usage.
	 */
	clear(): void {
		this.queue.clear();
	}
}
