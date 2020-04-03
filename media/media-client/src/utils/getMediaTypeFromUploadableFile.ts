import { UploadableFile, MediaType } from '..';
import { getMediaTypeFromMimeType } from './getMediaTypeFromMimeType';

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
