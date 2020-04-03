import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  packageAttributes,
  fileStateToFileGasPayload,
  FileGasPayload,
  PackageAttributes,
} from './index';
import { FileState, FileStatus } from '@atlaskit/media-client';
import { MediaViewerError } from '../error';

interface DownloadAttributes extends FileGasPayload {
  fileSupported?: boolean;
  fileProcessingStatus: FileStatus;
}

const getBasePayload = (actionSubjectId: string): GasPayload => ({
  eventType: 'ui',
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId,
});

const getBaseAttributes = (fileState: FileState) => ({
  ...fileStateToFileGasPayload(fileState),
  fileProcessingStatus: fileState.status,
  ...packageAttributes,
});

const downloadEvent = (
  fileState: FileState,
  actionSubjectId: string,
  failReason?: string,
) => {
  const basePayload = getBasePayload(actionSubjectId);
  const baseAttributes = failReason
    ? {
        ...getBaseAttributes(fileState),
        failReason,
      }
    : getBaseAttributes(fileState);
  switch (fileState.status) {
    case 'processed':
    case 'uploading':
    case 'processing':
    case 'failed-processing':
      return {
        ...basePayload,
        attributes: {
          ...baseAttributes,
          fileSupported: fileState.mediaType !== 'unknown',
        },
      };
    case 'error':
      return {
        ...basePayload,
        attributes: {
          ...baseAttributes,
        },
      };
  }
};

export interface DownloadGasPayload extends GasPayload {
  attributes: DownloadAttributes & PackageAttributes;
}

export function downloadErrorButtonEvent(
  state: FileState,
  err: MediaViewerError,
): DownloadGasPayload {
  return downloadEvent(state, 'failedPreviewDownloadButton', err.errorName);
}

export function downloadButtonEvent(state: FileState): DownloadGasPayload {
  return downloadEvent(state, 'downloadButton');
}
