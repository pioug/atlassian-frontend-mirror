import { FileStatus } from '@atlaskit/media-client';
import { CardStatus } from '../../';

export type GetCardStatusParams = {
  isPreviewableType: boolean;
  isPreviewableFileState: boolean;
  hasFilesize: boolean;
};

export const getCardStatus = (
  fileStatus: FileStatus,
  {
    isPreviewableType,
    hasFilesize,
    isPreviewableFileState,
  }: GetCardStatusParams,
): CardStatus => {
  switch (fileStatus) {
    case 'uploading':
    case 'failed-processing':
    case 'error':
      return fileStatus;
    case 'processing':
      // Legacy empty files logic
      // isPreviewableType will most likely be false for empty files,
      // therefore we need to do this cut before that check.
      // TODO: https://product-fabric.atlassian.net/browse/BMPT-1247
      if (!hasFilesize) {
        return 'processing';
      }
      // If we show no preview for this file
      // we won't show the "creating preview" message
      // i.e. Card is "complete".
      if (!isPreviewableType || isPreviewableFileState) {
        return 'complete';
      }
      return 'processing';
    case 'processed':
      return 'complete';
    default:
      return 'loading';
  }
};
