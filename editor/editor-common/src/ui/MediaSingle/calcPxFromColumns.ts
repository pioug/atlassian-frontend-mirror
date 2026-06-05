import { MEDIA_SINGLE_GUTTER_SIZE } from '../../media-single/constants';

export function calcPxFromColumns(columns: number, lineLength: number, gridSize: number): number {
	const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
	return (maxWidth / gridSize) * columns - MEDIA_SINGLE_GUTTER_SIZE;
}
