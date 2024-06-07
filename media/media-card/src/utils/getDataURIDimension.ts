import { isRetina } from './isRetina';
import { type CardDimensions } from '../types';
import { type ElementDimension, getElementDimension } from './getElementDimension';
import { defaultImageCardDimensions } from './cardDimensions';
import { isValidPercentageUnit } from './isValidPercentageUnit';
import { containsPixelUnit } from './containsPixelUnit';
import { type NumericalCardDimensions } from '@atlaskit/media-common';

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

export const getRequestedDimensions = (
	options: getDataURIDimensionOptions,
): NumericalCardDimensions => {
	const width = getDataURIDimension('width', options);
	const height = getDataURIDimension('height', options);
	return {
		width,
		height,
	};
};

/**
 * ************************************************
 * For Card v2
 * ************************************************
 */

type ResolveCardDimensionOptions = {
	element?: Element | null;
	dimensions?: CardDimensions;
};

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

export const resolveCardPreviewDimensions = (
	options: ResolveCardDimensionOptions,
): NumericalCardDimensions => {
	const width = resolveCardPreviewDimension('width', options);
	const height = resolveCardPreviewDimension('height', options);
	return {
		width,
		height,
	};
};
