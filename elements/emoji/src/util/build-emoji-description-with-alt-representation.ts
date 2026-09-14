import type { EmojiDescriptionWithVariations, EmojiRepresentation } from '../types';

// Prevent altRepresentation: undefined from being returned in EmojiDescription
export const buildEmojiDescriptionWithAltRepresentation = (
	emoji: EmojiDescriptionWithVariations,
	altRepresentation?: EmojiRepresentation,
): EmojiDescriptionWithVariations => {
	if (!altRepresentation) {
		return emoji;
	}
	return {
		...emoji,
		altRepresentation,
	};
};
