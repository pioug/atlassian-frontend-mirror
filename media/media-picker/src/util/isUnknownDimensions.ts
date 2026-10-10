import type { Dimensions } from '@atlaskit/media-client/get-dimensions-from-blob';

export const isUnknownDimensions = (dimensions: Dimensions): boolean =>
	!dimensions.width && !dimensions.height;
