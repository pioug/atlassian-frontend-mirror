/**
 * Mocking out emojis for the editor, so they easily fall back to text.
 */
import type { EmojiProvider, EmojiRepository } from '@atlaskit/emoji/resource';
import type { EmojiDescription, EmojiId } from '@atlaskit/emoji';

class EmojiProviderImpl implements EmojiProvider {
	findByShortName() {
		return undefined;
	}

	fetchByEmojiId() {
		return undefined;
	}

	findByEmojiId() {
		return undefined;
	}

	findById() {
		return undefined;
	}

	findInCategory() {
		return Promise.resolve([]);
	}

	getAsciiMap() {
		return Promise.resolve(new Map());
	}

	getFrequentlyUsed() {
		return Promise.resolve([]);
	}

	recordSelection() {
		return Promise.resolve();
	}

	deleteSiteEmoji() {
		return Promise.resolve(false);
	}

	loadMediaEmoji() {
		return undefined;
	}

	optimisticMediaRendering() {
		return false;
	}

	getSelectedTone() {
		return undefined;
	}

	getCurrentUser() {
		return undefined;
	}

	getMediaEmojiDescriptionURLWithInlineToken(emoji: EmojiDescription) {
		return Promise.resolve(emoji);
	}

	fetchEmojiProvider(force?: boolean): Promise<EmojiRepository | undefined> {
		return Promise.resolve(undefined);
	}

	getOptimisticImageURL(emojiId: EmojiId): string | undefined {
		return undefined;
	}

	setSelectedTone() {}
	filter() {}
	subscribe() {}
	unsubscribe() {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new EmojiProviderImpl();
