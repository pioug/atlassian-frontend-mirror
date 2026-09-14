import { type NumericalCardDimensions } from '@atlaskit/media-common';

import type { ResolveCardDimensionOptions } from './getDataURIDimension';
import { resolveCardPreviewDimension } from './resolveCardPreviewDimension';

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
