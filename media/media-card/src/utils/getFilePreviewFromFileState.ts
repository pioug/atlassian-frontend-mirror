import VideoSnapshot from 'video-snapshot';
import {
  FileState,
  getMediaTypeFromMimeType,
  isMimeTypeSupportedByBrowser,
  isPreviewableFileState,
  isErrorFileState,
} from '@atlaskit/media-client';
import { getOrientation } from '@atlaskit/media-ui';

export interface FilePreview {
  src?: string;
  orientation?: number;
}

export const getFilePreviewFromFileState = async (
  fileState: FileState,
): Promise<FilePreview> => {
  /**
   * We don't await on local preview for these following use cases:
   * - fileState is in error
   * - fileState isn't previewable
   * - media hasn't been processed and isn't natively supported by browser
   * - media has failed processing
   */
  if (
    isErrorFileState(fileState) ||
    !isPreviewableFileState(fileState) ||
    (!isMimeTypeSupportedByBrowser(fileState.mimeType) &&
      fileState.status !== 'processed') ||
    ['error', 'failed-processing'].includes(fileState.status)
  ) {
    return {};
  }

  const { value } = await fileState.preview;
  if (value instanceof Blob) {
    const { type } = value;
    const mediaType = getMediaTypeFromMimeType(type);

    if (mediaType === 'image') {
      const orientation = await getOrientation(value as File);
      const src = URL.createObjectURL(value);

      return {
        src,
        orientation,
      };
    }

    if (mediaType === 'video') {
      const snapshoter = new VideoSnapshot(value);
      const src = await snapshoter.takeSnapshot();

      snapshoter.end();

      return {
        src,
        orientation: 1,
      };
    }
  } else {
    return {
      src: value,
      orientation: 1,
    };
  }

  return {};
};
