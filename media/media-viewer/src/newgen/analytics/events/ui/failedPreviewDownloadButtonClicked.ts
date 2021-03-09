import { WithFileAttributes } from '@atlaskit/media-common';
import { FileStatus, FileState } from '@atlaskit/media-client';
import { getFileAttributes } from '../..';
import { ButtonClickEventPayload } from './_clickedButton';
import { AvailableErrorReason, getPrimaryErrorReason } from '../../../errors';

export type FailedPreviewDownloadButtonClickedAttributes = WithFileAttributes & {
  fileProcessingStatus: FileStatus;
  failReason: AvailableErrorReason;
};

export type FailedPreviewDownloadButtonClickedEventPayload = ButtonClickEventPayload<
  FailedPreviewDownloadButtonClickedAttributes
>;

export const createFailedPreviewDownloadButtonClickedEvent = (
  fileState: FileState,
  error: Error,
): FailedPreviewDownloadButtonClickedEventPayload => {
  const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(
    fileState,
  );
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'failedPreviewDownloadButton',
    attributes: {
      failReason: getPrimaryErrorReason(error),
      fileAttributes: {
        fileId,
        fileMediatype,
        fileMimetype,
        fileSize,
      },
      fileProcessingStatus: fileState.status,
    },
  };
};
