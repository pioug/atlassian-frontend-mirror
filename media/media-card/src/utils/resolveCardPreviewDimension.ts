import { defaultImageCardDimensions } from './cardDimensions';
import { containsPixelUnit } from './containsPixelUnit';
import type { ResolveCardDimensionOptions } from './getDataURIDimension';
import { type ElementDimension, getElementDimension } from './getElementDimension';
import { isValidPercentageUnit } from './isValidPercentageUnit';

// Same as getDataURIDimension but without Retina factor
export const resolveCardPreviewDimension = (
	dimensionName: ElementDimension,
	{ dimensions, element }: ResolveCardDimensionOptions,
): number => {
	const dimensionValue = dimensions?.[dimensionName] || '';

	if (isValidPercentageUnit(dimensionValue) && element) {
		return getElementDimension(element, dimensionName);
	}

	if (typeof dimensionValue === 'number') {
		return dimensionValue;
	}

	if (containsPixelUnit(`${dimensionValue}`)) {
		return parseInt(`${dimensionValue}`, 10);
	}

	return defaultImageCardDimensions[dimensionName];
};
