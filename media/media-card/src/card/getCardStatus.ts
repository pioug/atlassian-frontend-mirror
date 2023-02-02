import { FileStatus } from '@atlaskit/media-client';
import { MediaFeatureFlags, getMediaFeatureFlag } from '@atlaskit/media-common';
import { CardStatus, FilePreviewStatus } from '../types';

export const isFinalCardStatus = (status: CardStatus) =>
  ['complete', 'error', 'failed-processing'].includes(status);

const getCardStatusBuggy = (
  fileStatus: FileStatus,
  { hasFilesize, isPreviewable, hasPreview }: FilePreviewStatus,
): CardStatus => {
  switch (fileStatus) {
    case 'uploading':
    case 'failed-processing':
    case 'error':
      return fileStatus;
    case 'processing':
      // Legacy empty files logic
      // isPreviewable will most likely be false for empty files,
      // therefore we need to do this cut before that check.
      // TODO: https://product-fabric.atlassian.net/browse/BMPT-1247
      if (!hasFilesize) {
        return 'processing';
      }
      // If we show no preview for this file
      // we won't show the "creating preview" message, i.e. Card is "complete".
      if (!isPreviewable) {
        return 'complete';
      }
      return 'processing';
    case 'processed':
      if (!isPreviewable || !hasPreview) {
        return 'complete';
      }
      return 'loading-preview';
    default:
      return 'loading';
  }
};

const getCardStatusFixed = (
  fileStatus: FileStatus,
  { isPreviewable, hasPreview }: FilePreviewStatus,
): CardStatus => {
  switch (fileStatus) {
    case 'uploading':
    case 'failed-processing':
    case 'error':
    case 'processing':
      return fileStatus;
    case 'processed':
      if (!isPreviewable || !hasPreview) {
        return 'complete';
      }
      return 'loading-preview';
    default:
      return 'loading';
  }
};

export const getCardStatus = (
  fileStatus: FileStatus,
  filePreviewStatus: FilePreviewStatus,
  featureFlags?: MediaFeatureFlags,
): CardStatus => {
  if (getMediaFeatureFlag('fetchFileStateAfterUpload', featureFlags)) {
    return getCardStatusFixed(fileStatus, filePreviewStatus);
  }
  return getCardStatusBuggy(fileStatus, filePreviewStatus);
};
