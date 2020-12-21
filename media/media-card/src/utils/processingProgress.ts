import {
  UploadingFileState,
  ProcessingFileState,
  isPreviewableFileState,
  isMimeTypeSupportedByBrowser,
  isMimeTypeSupportedByServer,
} from '@atlaskit/media-client';
import { MediaFeatureFlags, getMediaFeatureFlag } from '@atlaskit/media-common';

/**
 * Current settings are optimized for a processing time of max 20 secs:
 *
 * - PROCESSING_UPLOAD_PORTION: portion of processing time of upload progress bar
 * - PROCESSING_STEP: processing step of upload progress bar
 * - PROCESSING_MAX_VALUE: max value set on upload progress bar
 * - PROCESSING_TICK: how often we refresh upload progress bar
 *
 * Currently: 0.8ms * (PROCESSING_MAX_VALUE - PROCESSING_UPLOAD_PORTION) / PROCESSING_STEP = 15 sec
 */
export const PROCESSING_UPLOAD_PORTION = 0.65;
export const PROCESSING_STEP = 0.02;
export const PROCESSING_MAX_VALUE = 0.95;
export const PROCESSING_TICK = 800;

export function shouldShowProcessingProgress(
  fileState: UploadingFileState | ProcessingFileState,
  featureFlags?: MediaFeatureFlags,
): boolean {
  const { mediaType, mimeType } = fileState;

  // TODO MPT-603: for "empty files", we receive no mimeType despite our TS types disallow that
  if (!mimeType) {
    return false;
  }

  if (
    !getMediaFeatureFlag('newCardExperience', featureFlags) &&
    mediaType === 'doc'
  ) {
    return false;
  }

  const canBePreviewed =
    isPreviewableFileState(fileState) && isMimeTypeSupportedByBrowser(mimeType);

  // in the new experience, we show processing time for all documents,
  // or if file can't be previewed and can be processed
  if (getMediaFeatureFlag('newCardExperience', featureFlags)) {
    return (
      (mediaType === 'doc' || !canBePreviewed) &&
      isMimeTypeSupportedByServer(mimeType)
    );
  }

  // in classic experience, we show processing time if file can't be previewed but can be processed
  return !canBePreviewed && isMimeTypeSupportedByServer(mimeType);
}

export function createProcessingProgressTimer(
  updateProgress: (progress: number) => void,
  opts: {
    lastProgress?: number;
    lastTimer?: number;
  } = {},
): number {
  const { lastProgress, lastTimer } = opts;

  clearProcessingProgressTimer(lastTimer);

  let processingProgress = lastProgress || PROCESSING_UPLOAD_PORTION;
  return window.setInterval(() => {
    // increment progress by PROCESSING_STEP each poll, never exceed PROCESSING_MAX_VALUE
    processingProgress = Math.min(
      PROCESSING_MAX_VALUE,
      processingProgress + PROCESSING_STEP,
    );

    updateProgress(processingProgress);
  }, PROCESSING_TICK);
}

export function clearProcessingProgressTimer(timer?: number) {
  if (timer) {
    clearInterval(timer);
  }
}
