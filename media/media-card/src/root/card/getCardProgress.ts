import { FileState } from '@atlaskit/media-client';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { CardStatus } from '../..';
import {
  PROCESSING_UPLOAD_PORTION,
  shouldShowProcessingProgress,
  createProcessingProgressTimer,
  clearProcessingProgressTimer,
} from '../../utils/processingProgress';

export function completeCardProgress(
  status: CardStatus,
  updateProgress: (progress: number) => void,
  opts: {
    lastStatus?: CardStatus;
    lastProgress?: number;
    lastTimer?: number;
  } = {},
) {
  const { lastStatus, lastProgress, lastTimer } = opts;

  clearProcessingProgressTimer(lastTimer);

  if (lastProgress !== 1 || lastStatus !== status) {
    updateProgress(1);
  }
}

export const updateProgressFromFileState = (
  fileState: FileState,
  status: CardStatus,
  updateCardProgress: (progress: number) => void,
  opts: {
    lastStatus?: CardStatus;
    lastProgress?: number;
    lastTimer?: number;
    featureFlags?: MediaFeatureFlags;
  } = {},
): number | undefined => {
  const { lastStatus, lastProgress, lastTimer, featureFlags } = opts;

  switch (fileState.status) {
    case 'uploading': {
      const { progress } = fileState;
      updateCardProgress(
        shouldShowProcessingProgress(fileState, featureFlags)
          ? progress * PROCESSING_UPLOAD_PORTION
          : progress,
      );
      break;
    }
    case 'processing': {
      if (!shouldShowProcessingProgress(fileState, featureFlags)) {
        completeCardProgress(status, updateCardProgress, {
          lastStatus,
          lastProgress,
          lastTimer,
        });
        break;
      }

      return createProcessingProgressTimer(updateCardProgress, {
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
