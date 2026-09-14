import type { ImageRepresentation, MediaApiRepresentation } from '../types';

export const convertImageToMediaRepresentation = (
	rep: ImageRepresentation,
): MediaApiRepresentation => ({
	mediaPath: rep.imagePath,
	height: rep.height,
	width: rep.width,
});
