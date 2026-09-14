import {
	type EmojiDescriptionWithVariations,
	type EmojiVariationDescription,
	type EmojiMeta,
	type EmojiServiceDescription,
	type EmojiServiceDescriptionWithVariations,
} from '../types';
import { denormaliseServiceAltRepresentation } from './denormaliseServiceAltRepresentation';
import { denormaliseStandardRepresentation } from './denormaliseStandardRepresentation';

export const denormaliseSkinEmoji = (
	emoji: EmojiServiceDescriptionWithVariations,
	meta?: EmojiMeta,
): EmojiDescriptionWithVariations[] => {
	if (!emoji.skinVariations) {
		return [];
	}

	const skinEmoji: EmojiServiceDescription[] = emoji.skinVariations;
	const baseId = emoji.id;

	return skinEmoji.map((skin): EmojiVariationDescription => {
		const { representation: _representation, altRepresentations, ...other } = skin;
		return {
			baseId: baseId,
			representation: denormaliseStandardRepresentation(skin, meta),
			altRepresentation: denormaliseServiceAltRepresentation(altRepresentations, meta),
			...other,
		};
	});
};
