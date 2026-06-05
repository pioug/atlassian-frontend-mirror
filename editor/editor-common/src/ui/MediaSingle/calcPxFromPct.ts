import { MEDIA_SINGLE_GUTTER_SIZE } from '../../media-single/constants';

export function calcPxFromPct(pct: number, lineLength: number): number {
	const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
	return maxWidth * pct - MEDIA_SINGLE_GUTTER_SIZE;
}
