import VideoSnapshot from 'video-snapshot';
import { FileState, getMediaTypeFromMimeType } from '@atlaskit/media-client';
import { getOrientation } from '@atlaskit/media-ui';

export interface FilePreview {
  src?: string;
  orientation?: number;
}

export const getDataURIFromFileState = async (
  state: FileState,
): Promise<FilePreview> => {
  if (
    state.status === 'error' ||
    state.status === 'failed-processing' ||
    !state.preview
  ) {
    return {};
  }
  const { value } = await state.preview;
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
