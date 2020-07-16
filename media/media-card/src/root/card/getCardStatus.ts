import {
  FileState,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-client';
import { CardState, CardProps, CardStatus } from '../../';
import {
  PROCESSING_UPLOAD_PORTION,
  createProcessingProgressTimer,
  clearProcessingProgressTimer,
} from '../../utils/processingProgress';

// we don't want to show complete status for empty files, ideally there should be no such file on the media api,
// but there are some edge cases when using id upfront that can result on that.
export const getCardStatus = (
  state: CardState,
  props: CardProps,
): CardStatus => {
  const { status, metadata } = state;
  const { identifier } = props;

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
): CardStatus => {
  switch (fileState.status) {
    case 'uploading':
    case 'failed-processing':
    case 'error':
      return fileState.status;
    case 'processed':
      return 'complete';
    case 'processing':
      // TODO MPT-603: temporaryly fixing empty files sending an empty "mimeType" (fix it better as part of MPT-603)
      if (
        !!fileState.mimeType &&
        isMimeTypeSupportedByBrowser(fileState.mimeType)
      ) {
        return 'complete';
      } else {
        // processing of a non-supported file is part of upload time
        return 'uploading';
      }
    default:
      return 'loading';
  }
};

export function completeCardProgress(
  status: CardStatus,
  updateProgress: (status: CardStatus, progress: number) => void,
  opts: {
    lastStatus?: CardStatus;
    lastProgress?: number;
    lastTimer?: number;
  } = {},
) {
  const { lastStatus, lastProgress, lastTimer } = opts;

  clearProcessingProgressTimer(lastTimer);

  if (lastProgress !== 1 || lastStatus !== status) {
    updateProgress(status, 1);
  }
}

export const updateCardStatusFromFileState = (
  fileState: FileState,
  status: CardStatus,
  updateCardProgress: (status: CardStatus, progress: number) => void,
  opts: {
    lastStatus?: CardStatus;
    lastProgress?: number;
    lastTimer?: number;
  } = {},
): number | undefined => {
  const { lastStatus, lastProgress, lastTimer } = opts;

  switch (fileState.status) {
    case 'uploading': {
      const { mimeType, progress } = fileState;
      updateCardProgress(
        status,
        isMimeTypeSupportedByBrowser(mimeType)
          ? progress
          : progress * PROCESSING_UPLOAD_PORTION,
      );
      break;
    }
    case 'processing': {
      const { mimeType } = fileState;
      // TODO MPT-603: temporaryly fixing empty files sending an empty "mimeType" (fix it better as part of MPT-603)
      if (!!fileState.mimeType && isMimeTypeSupportedByBrowser(mimeType)) {
        completeCardProgress(status, updateCardProgress, {
          lastStatus,
          lastProgress,
          lastTimer,
        });
        break;
      }

      return createProcessingProgressTimer(status, updateCardProgress, {
        lastProgress,
        lastTimer,
      });
    }
    default:
      completeCardProgress(status, updateCardProgress, {
        lastStatus,
        lastProgress,
        lastTimer,
      });
      break;
  }
};
