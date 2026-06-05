import { MEDIA_SINGLE_GUTTER_SIZE } from '../../media-single/constants';

export function calcColumnsFromPx(width: number, lineLength: number, gridSize: number): number {
	const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
	return ((width + MEDIA_SINGLE_GUTTER_SIZE) * gridSize) / maxWidth;
}
