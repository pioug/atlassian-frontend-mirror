import {
  SuccessAttributes,
  WithFileAttributes,
  FileAttributes,
} from '@atlaskit/media-common';
import { MediaFileEventPayload } from './_mediaFile';

export type LoadSucceededAttributes = SuccessAttributes & WithFileAttributes;

export type LoadSucceededEventPayload = MediaFileEventPayload<
  LoadSucceededAttributes,
  'loadSucceeded'
>;

export const createLoadSucceededEvent = ({
  fileId,
  fileMediatype,
  fileMimetype,
  fileSize,
}: FileAttributes): LoadSucceededEventPayload => {
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
