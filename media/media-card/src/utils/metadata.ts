import {
  FileState,
  FileDetails,
  getMediaTypeFromMimeType,
} from '@atlaskit/media-client';

export const extendMetadata = (
  state: FileState,
  metadata?: FileDetails,
): FileDetails => {
  const { id } = state;
  const currentMediaType = metadata && metadata.mediaType;
  if (state.status !== 'error') {
    return {
      id,
      name: state.name,
      size: state.size,
      mimeType: state.mimeType,
      createdAt: state.createdAt,
      // We preserve the initial mediaType
      // in case file subscription returns 'unknown' we try to deduce it from mimeType
      mediaType:
        currentMediaType && currentMediaType !== 'unknown'
          ? currentMediaType
          : state.mimeType
          ? getMediaTypeFromMimeType(state.mimeType)
          : 'unknown',
    };
  } else {
    return {
      id,
    };
  }
};
