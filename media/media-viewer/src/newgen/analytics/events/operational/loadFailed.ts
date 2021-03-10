import { FileState } from '@atlaskit/media-client';
import { MediaFileEventPayload } from './_mediaFile';
import { getFileAttributes, MediaViewerFailureAttributes } from '../..';
import {
  getPrimaryErrorReason,
  getSecondaryErrorReason,
  getErrorDetail,
} from '../../../errors';

export type LoadFailedEventPayload = MediaFileEventPayload<
  MediaViewerFailureAttributes,
  'loadFailed'
>;

export const createLoadFailedEvent = (
  fileId: string,
  error: Error,
  fileState?: FileState,
): LoadFailedEventPayload => {
  const { fileMediatype, fileMimetype, fileSize } = getFileAttributes(
    fileState,
  );
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    action: 'loadFailed',
    attributes: {
      status: 'fail',
      failReason: getPrimaryErrorReason(error),
      error: getSecondaryErrorReason(error),
      errorDetail: getErrorDetail(error),
      fileAttributes: {
        fileId,
        fileMediatype,
        fileMimetype,
        fileSize,
      },
    },
  };
};