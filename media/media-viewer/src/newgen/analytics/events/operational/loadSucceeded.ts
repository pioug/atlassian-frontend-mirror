import { FileState } from '@atlaskit/media-client';
import { SuccessAttributes, WithFileAttributes } from '@atlaskit/media-common';
import { MediaFileEventPayload } from './_mediaFile';
import { getFileAttributes } from '../..';

export type LoadSucceededAttributes = SuccessAttributes & WithFileAttributes;

export type LoadSucceededEventPayload = MediaFileEventPayload<
  LoadSucceededAttributes,
  'loadSucceeded'
>;

export const createLoadSucceededEvent = (
  fileState: FileState,
): LoadSucceededEventPayload => {
  const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(
    fileState,
  );
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    action: 'loadSucceeded',
    attributes: {
      status: 'success',
      fileAttributes: {
        fileId,
        fileMediatype,
        fileMimetype,
        fileSize,
      },
    },
  };
};
