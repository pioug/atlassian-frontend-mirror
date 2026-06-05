import { MEDIA_SINGLE_GUTTER_SIZE } from '../../media-single/constants';

export function calcPctFromPx(width: number, lineLength: number): number {
	const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
	return (width + MEDIA_SINGLE_GUTTER_SIZE) / maxWidth;
}
