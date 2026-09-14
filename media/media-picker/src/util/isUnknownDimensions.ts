import { type Dimensions } from '@atlaskit/media-client';

export const isUnknownDimensions = (dimensions: Dimensions): boolean =>
	!dimensions.width && !dimensions.height;
