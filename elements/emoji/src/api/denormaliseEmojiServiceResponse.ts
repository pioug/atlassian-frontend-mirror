import {
	type EmojiDescription,
	type EmojiDescriptionWithVariations,
	type EmojiResponse,
	type EmojiServiceDescriptionWithVariations,
	type EmojiServiceResponse,
} from '../types';
import { buildEmojiDescriptionWithAltRepresentation } from '../util/build-emoji-description-with-alt-representation';
import { denormaliseServiceAltRepresentation } from './denormaliseServiceAltRepresentation';
import { denormaliseSkinEmoji } from './denormaliseSkinEmoji';
import { denormaliseStandardRepresentation } from './denormaliseStandardRepresentation';

/**
 * Denormalised an emoji response (emojis + sprite references) into an array of
 * emoji with local sprite definitions.
 */
export const denormaliseEmojiServiceResponse = (emojiData: EmojiServiceResponse): EmojiResponse => {
	const emojis: EmojiDescription[] = emojiData.emojis.map(
		(emoji: EmojiServiceDescriptionWithVariations): EmojiDescriptionWithVariations => {
			const newRepresentation = denormaliseStandardRepresentation(emoji, emojiData.meta);
			const altRepresentation = denormaliseServiceAltRepresentation(
				emoji.altRepresentations,
				emojiData.meta,
			);
			const newSkinVariations = denormaliseSkinEmoji(emoji, emojiData.meta);

			// create trimmedServiceDesc which is emoji with no representations or skinVariations
			const {
				representation: _representation,
				skinVariations: _skinVariations,
				altRepresentations: _altRepresentations,
				...trimmedServiceDesc
			} = emoji;

			const response: EmojiDescriptionWithVariations = {
				...trimmedServiceDesc,
				representation: newRepresentation,
				skinVariations: newSkinVariations,
			};
			return buildEmojiDescriptionWithAltRepresentation(response, altRepresentation);
		},
	);

	const mediaApiToken = emojiData.meta && emojiData.meta.mediaApiToken;

	return {
		emojis,
		mediaApiToken,
	};
};
