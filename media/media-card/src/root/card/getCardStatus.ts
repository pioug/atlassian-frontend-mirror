import { FileDetails, FileState } from '@atlaskit/media-client';
import { CardState, CardProps, CardStatus } from '../../';

// we don't want to show complete status for empty files, ideally there should be no such file on the media api,
// but there are some edge cases when using id upfront that can result on that.
export const getCardStatus = (
  state: CardState,
  props: CardProps,
): CardStatus => {
  const { status, metadata, dataURI } = state;
  const { identifier, disableOverlay } = props;

  if (identifier.mediaItemType !== 'file') {
    return status;
  }

  if (metadata) {
    const { size, mediaType, name } = metadata as FileDetails;
    if (mediaType === 'image' || mediaType === 'video') {
      if (status === 'complete' && !dataURI) {
        return 'processing';
      }
    } else if (name && size && !disableOverlay && status === 'processing') {
      // If we have enough metadata for non images, we show it
      return 'complete';
    } else if (status === 'complete' && !size) {
      return 'processing';
    }
  }

  return status;
};

export const getCardStatusFromFileState = (
  fileState: FileState,
  dataURI?: string,
): CardStatus => {
  switch (fileState.status) {
    case 'uploading':
    case 'failed-processing':
    case 'error':
      return fileState.status;
    case 'processed':
      return 'complete';
    case 'processing':
      if (dataURI) {
        return 'complete';
      } else {
        return 'processing';
      }
    default:
      return 'loading';
  }
};

export const getCardProgressFromFileState = (
  fileState: FileState,
  dataURI?: string,
) => {
  switch (fileState.status) {
    case 'uploading':
      return fileState.progress;
    case 'processing':
      if (dataURI) {
        return 1;
      }
  }
};
