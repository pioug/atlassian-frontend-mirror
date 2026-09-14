import { type EmojiDescription, type SearchOptions } from '../types';
import { isEmojiDescriptionWithVariations } from '../util/is-emoji-description-with-variations';

export const getEmojiVariation = (
	emoji: EmojiDescription,
	options?: SearchOptions,
): EmojiDescription => {
	if (isEmojiDescriptionWithVariations(emoji) && options) {
		const skinTone = options.skinTone;
		if (skinTone && emoji.skinVariations && emoji.skinVariations.length) {
			const skinToneEmoji = emoji.skinVariations[skinTone - 1]; // skinTone start at 1
			if (skinToneEmoji) {
				return skinToneEmoji;
			}
		}
	}
	return emoji;
};
