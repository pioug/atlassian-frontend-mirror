import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { getDataURIDimension, type getDataURIDimensionOptions } from './getDataURIDimension';

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
