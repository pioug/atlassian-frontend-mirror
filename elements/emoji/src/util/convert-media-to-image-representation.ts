import type { ImageRepresentation, MediaApiRepresentation } from '../types';

export const convertMediaToImageRepresentation = (
	rep: MediaApiRepresentation,
	newImagePath?: string,
): ImageRepresentation => ({
	imagePath: newImagePath || rep.mediaPath,
	height: rep.height,
	width: rep.width,
});
