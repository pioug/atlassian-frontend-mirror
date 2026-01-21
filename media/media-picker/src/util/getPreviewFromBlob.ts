import { type MediaType, type Dimensions, getDimensionsFromBlob } from '@atlaskit/media-client';

import { type Preview } from '../types';

export const isUnknownDimensions = (dimensions: Dimensions): boolean =>
	!dimensions.width && !dimensions.height;

export async function getPreviewFromBlob(mediaType: MediaType, file: Blob): Promise<Preview> {
	switch (mediaType) {
		case 'image':
		case 'video': {
			const dimensions = await getDimensionsFromBlob(mediaType, file);

			if (isUnknownDimensions(dimensions)) {
				return { file, scaleFactor: 1 };
			}

			return { file, dimensions, scaleFactor: 1 };
		}
		default:
			return { file };
	}
}
