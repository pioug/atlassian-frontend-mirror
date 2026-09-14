import { type MediaType } from '@atlaskit/media-client';
import { getMediaTypeFromMimeType } from '@atlaskit/media-common';

import { getMimeTypeFromFilename } from './getMimeTypeFromFilename';

export const getMediaTypeFromFilename = (filename: string): MediaType => {
	const mimeType = getMimeTypeFromFilename(filename);
	return getMediaTypeFromMimeType(mimeType);
};
