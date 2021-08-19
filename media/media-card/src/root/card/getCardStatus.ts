import { FileStatus } from '@atlaskit/media-client';
import { CardStatus, FilePreviewStatus } from '../../types';

export const getCardStatus = (
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
