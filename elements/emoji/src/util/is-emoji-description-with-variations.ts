import type { EmojiDescriptionWithVariations, OptionalEmojiDescription } from '../types';

export const isEmojiDescriptionWithVariations = (
	emoji: OptionalEmojiDescription,
): emoji is EmojiDescriptionWithVariations =>
	!!(emoji && (emoji as EmojiDescriptionWithVariations).skinVariations);
