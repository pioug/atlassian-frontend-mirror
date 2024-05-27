import { getMediaTypeFromMimeType } from '@atlaskit/media-common/mediaTypeUtils';

import { type MediaType } from '../models/media';
import { type UploadableFile } from '../uploader';

export const getMediaTypeFromUploadableFile = (
  file: UploadableFile,
): MediaType => {
  if (file.content instanceof Blob) {
    const type = file.content.type;

    return getMediaTypeFromMimeType(type);
  } else {
    return 'unknown';
  }
};
