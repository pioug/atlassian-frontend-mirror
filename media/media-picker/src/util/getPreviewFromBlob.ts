import { getDimensionsFromBlob } from '@atlaskit/media-client/get-dimensions-from-blob';
import type { MediaType } from '@atlaskit/media-common/main-types';

import { type Preview } from '../types';
import { isUnknownDimensions } from './isUnknownDimensions';

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
