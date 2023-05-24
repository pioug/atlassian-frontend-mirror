import { FileStatus } from '@atlaskit/media-client';
import { CardStatus, FilePreviewStatus } from '../types';

export const isFinalCardStatus = (status: CardStatus) =>
  ['complete', 'error', 'failed-processing'].includes(status);

export const getCardStatus = (
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
