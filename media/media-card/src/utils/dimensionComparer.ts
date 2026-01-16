import { isValidPercentageUnit } from './isValidPercentageUnit';
import { containsPixelUnit } from './containsPixelUnit';
import { type CardDimensionValue, type CardDimensions } from '../types';

const isPixelEquivalent = (dimension: CardDimensionValue) =>
	typeof dimension === 'number' || containsPixelUnit(`${dimension}`);

export const canCompareDimension = (current?: CardDimensionValue, next?: CardDimensionValue): boolean => {
	if (!current || !next) {
		return false;
	}
	const bothPixelEquivalent = isPixelEquivalent(current) && isPixelEquivalent(next);

	const bothPercentage = isValidPercentageUnit(current) && isValidPercentageUnit(next);

	return bothPixelEquivalent || bothPercentage;
};

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
