import type { EmojiDescription } from '../types';

export const isEmojiDescription = (
	possibleEmojiDescription: any,
): possibleEmojiDescription is EmojiDescription =>
	possibleEmojiDescription && possibleEmojiDescription.shortName && possibleEmojiDescription.type;
