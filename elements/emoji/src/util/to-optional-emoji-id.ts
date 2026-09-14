import type { EmojiId, OptionalEmojiDescription } from '../types';
import { toEmojiId } from './to-emoji-id';

export const toOptionalEmojiId = (emoji: OptionalEmojiDescription): EmojiId | undefined => {
	if (!emoji) {
		return undefined;
	}
	return toEmojiId(emoji);
};
