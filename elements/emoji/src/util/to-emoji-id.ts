import type { EmojiDescription, EmojiId } from '../types';

export const toEmojiId = (emoji: EmojiDescription): EmojiId => ({
	shortName: emoji.shortName,
	id: emoji.id,
	fallback: emoji.fallback,
});
