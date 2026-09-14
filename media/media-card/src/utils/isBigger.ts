import { type CardDimensions } from '../types';
import { canCompareDimension } from './canCompareDimension';

export const isBigger = (current?: CardDimensions, next?: CardDimensions): boolean => {
	if (
		!!current &&
		!!next &&
		canCompareDimension(current.width, next.width) &&
		canCompareDimension(current.height, next.height)
	) {
		const nextIsHigher = parseInt(`${current.width}`, 10) < parseInt(`${next.width}`, 10);
		const nextIsWider = parseInt(`${current.height}`, 10) < parseInt(`${next.height}`, 10);
		return nextIsHigher || nextIsWider;
	} else {
		return false;
	}
};
