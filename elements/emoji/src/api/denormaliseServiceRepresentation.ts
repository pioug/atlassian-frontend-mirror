import {
	type EmojiMeta,
	type EmojiRepresentation,
	type EmojiServiceRepresentation,
	type SpriteServiceRepresentation,
} from '../types';
import { convertImageToMediaRepresentation } from '../util/convert-image-to-media-representation';
import { isImageRepresentation } from '../util/is-image-representation';
import { isSpriteServiceRepresentation } from '../util/is-sprite-service-representation';
import debug from '../util/logger';
import { isMediaApiUrl } from './isMediaApiUrl';

export const denormaliseServiceRepresentation = (
	representation: EmojiServiceRepresentation,
	meta?: EmojiMeta,
): EmojiRepresentation => {
	if (isSpriteServiceRepresentation(representation) && meta && meta.spriteSheets) {
		const { height, width, x, y, xIndex, yIndex, spriteRef } =
			representation as SpriteServiceRepresentation;
		const spriteSheet = meta.spriteSheets[spriteRef];
		if (spriteSheet) {
			return {
				sprite: spriteSheet,
				height,
				width,
				x,
				y,
				xIndex,
				yIndex,
			};
		}
	} else if (isImageRepresentation(representation)) {
		const { height, width, imagePath } = representation;
		if (isMediaApiUrl(imagePath, meta)) {
			return convertImageToMediaRepresentation(representation);
		}
		return {
			height,
			width,
			imagePath,
		};
	}

	debug('failed conversion for representation', representation, meta);

	return undefined;
};
