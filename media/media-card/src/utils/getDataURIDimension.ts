import { type CardDimensions } from '../types';
import { defaultImageCardDimensions } from './cardDimensions';
import { containsPixelUnit } from './containsPixelUnit';
import { type ElementDimension, getElementDimension } from './getElementDimension';
import { isRetina } from './isRetina';
import { isValidPercentageUnit } from './isValidPercentageUnit';

/**
 * ************************************************
 * For Card v1
 * ************************************************
 */
export type getDataURIDimensionOptions = {
	element?: Element | null;
	dimensions?: CardDimensions;
};

export const getDataURIDimension = (
	dimension: ElementDimension,
	options: getDataURIDimensionOptions,
): number => {
	const retinaFactor = isRetina() ? 2 : 1;
	const dimensionValue = (options.dimensions && options.dimensions[dimension]) || '';

	if (isValidPercentageUnit(dimensionValue) && options.element) {
		return getElementDimension(options.element, dimension) * retinaFactor;
	}

	if (typeof dimensionValue === 'number') {
		return dimensionValue * retinaFactor;
	}

	if (containsPixelUnit(`${dimensionValue}`)) {
		return parseInt(`${dimensionValue}`, 10) * retinaFactor;
	}

	return defaultImageCardDimensions[dimension] * retinaFactor;
};

export /**
 * ************************************************
 * For Card v2
 * ************************************************
 */
type ResolveCardDimensionOptions = {
	element?: Element | null;
	dimensions?: CardDimensions;
};
