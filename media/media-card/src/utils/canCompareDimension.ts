import { type CardDimensionValue } from '../types';
import { containsPixelUnit } from './containsPixelUnit';
import { isValidPercentageUnit } from './isValidPercentageUnit';

const isPixelEquivalent = (dimension: CardDimensionValue) =>
	typeof dimension === 'number' || containsPixelUnit(`${dimension}`);

export const canCompareDimension = (
	current?: CardDimensionValue,
	next?: CardDimensionValue,
): boolean => {
	if (!current || !next) {
		return false;
	}
	const bothPixelEquivalent = isPixelEquivalent(current) && isPixelEquivalent(next);

	const bothPercentage = isValidPercentageUnit(current) && isValidPercentageUnit(next);

	return bothPixelEquivalent || bothPercentage;
};
