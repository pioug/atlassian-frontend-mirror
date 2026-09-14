import type { EmojiDescription, EmojiId } from '../types';
import { isEmojiIdEqual } from './is-emoji-id-equal';

export const containsEmojiId = (
	emojis: EmojiDescription[],
	emojiId: EmojiId | undefined,
): boolean => {
	if (!emojiId) {
		return false;
	}
	for (let i = 0; i < emojis.length; i++) {
		if (isEmojiIdEqual(emojis[i], emojiId)) {
			return true;
		}
	}
	return false;
};
