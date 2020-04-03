import { FileState, FileDetails } from '@atlaskit/media-client';

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
      mediaType:
        currentMediaType && currentMediaType !== 'unknown'
          ? currentMediaType
          : state.mediaType,
    };
  } else {
    return {
      id,
    };
  }
};
