import { WithFileAttributes } from '@atlaskit/media-common';
import { FileStatus, FileState } from '@atlaskit/media-client';
import { getFileAttributes } from '../..';
import { ButtonClickEventPayload } from './_clickedButton';

export type DownloadButtonClickedAttributes = WithFileAttributes & {
  fileProcessingStatus: FileStatus;
};

export type DownloadButtonClickedEventPayload = ButtonClickEventPayload<
  DownloadButtonClickedAttributes
>;

export const createDownloadButtonClickedEvent = (
  fileState: FileState,
): DownloadButtonClickedEventPayload => {
  const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(
    fileState,
  );
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'downloadButton',
    attributes: {
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
