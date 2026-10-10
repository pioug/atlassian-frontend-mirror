import type { MediaType } from '@atlaskit/media-common/main-types';
import { getMediaTypeFromMimeType } from '@atlaskit/media-common/mediaTypeUtils';

import { getMimeTypeFromFilename } from './getMimeTypeFromFilename';

export const getMediaTypeFromFilename = (filename: string): MediaType => {
	const mimeType = getMimeTypeFromFilename(filename);
	return getMediaTypeFromMimeType(mimeType);
};
