import { MediaFile } from '../types';

export function copyMediaFileForUpload(
  mediaFile: MediaFile,
  fileId: string,
): MediaFile {
  return {
    ...mediaFile,
    id: fileId,
  };
}
