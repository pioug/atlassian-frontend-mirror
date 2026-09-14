import type { EmojiDescription } from '../types';
import { buildEmojiDescriptionWithAltRepresentation } from './build-emoji-description-with-alt-representation';
import { convertMediaToImageRepresentation } from './convert-media-to-image-representation';
import { isMediaRepresentation } from './is-media-representation';

export const convertMediaToImageEmoji = (
	emoji: EmojiDescription,
	newImagePath?: string,
	useAlt?: boolean,
): EmojiDescription => {
	const mediaRepresentation = emoji.representation;
	const mediaAltRepresentation = emoji.altRepresentation;
	const imgPath = !useAlt ? newImagePath : undefined;
	const altImgPath = useAlt ? newImagePath : undefined;

	if (
		!isMediaRepresentation(mediaRepresentation) &&
		!isMediaRepresentation(mediaAltRepresentation)
	) {
		return emoji;
	}
	const representation = isMediaRepresentation(mediaRepresentation)
		? convertMediaToImageRepresentation(mediaRepresentation, imgPath)
		: mediaRepresentation;
	const altRepresentation = isMediaRepresentation(mediaAltRepresentation)
		? convertMediaToImageRepresentation(mediaAltRepresentation, altImgPath)
		: mediaAltRepresentation;
	const baseEmoji = {
		...emoji,
		representation,
	};
	return buildEmojiDescriptionWithAltRepresentation(baseEmoji, altRepresentation);
};
