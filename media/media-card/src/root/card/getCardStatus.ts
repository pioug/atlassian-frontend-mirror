import { FileState } from '@atlaskit/media-client';
import { getMediaFeatureFlag, MediaFeatureFlags } from '@atlaskit/media-common';
import { CardState, CardProps, CardStatus } from '../../';
import { shouldShowProcessingProgress } from '../../utils/processingProgress';

// we don't want to show complete status for empty files, ideally there should be no such file on the media api,
// but there are some edge cases when using id upfront that can result on that.
export const getCardStatus = (
  state: CardState,
  props: CardProps,
): CardStatus => {
  const { status, metadata, error } = state;
  const { identifier } = props;

  if (error) {
    return 'error';
  }

  if (identifier.mediaItemType !== 'file') {
    return status;
  }

  if (status === 'complete' && !!metadata && !metadata.size) {
    return 'processing';
  }

  return status;
};

export const getCardStatusFromFileState = (
  fileState: FileState,
  featureFlags?: MediaFeatureFlags,
): CardStatus => {
  switch (fileState.status) {
    case 'uploading':
    case 'failed-processing':
    case 'error':
      return fileState.status;
    case 'processed':
      return 'complete';
    case 'processing':
      if (shouldShowProcessingProgress(fileState, featureFlags)) {
        // we want to show the user that they can download & view a file while a preview is being generated
        if (getMediaFeatureFlag('newCardExperience', featureFlags)) {
          return 'processing';
        }
        // processing of a file is part of upload time
        return 'uploading';
      }
      return 'complete';
    default:
      return 'loading';
  }
};
