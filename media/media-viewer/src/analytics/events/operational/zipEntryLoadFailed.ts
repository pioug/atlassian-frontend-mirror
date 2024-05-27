import { type FileState } from '@atlaskit/media-client';
import { type ZipEntry } from 'unzipit';
import { type MediaFileEventPayload } from './_mediaFile';
import { type MediaViewerFailureAttributes, getFileAttributes } from '../..';
import { getMimeTypeFromFilename } from '../../../utils';
import {
  getPrimaryErrorReason,
  getSecondaryErrorReason,
  getErrorDetail,
  type MediaViewerError,
} from '../../../errors';

export type ZipEntryLoadFailedAttributes = MediaViewerFailureAttributes & {
  size: number;
  encrypted: boolean;
  compressedSize: number;
  mimeType: string;
};

export type ZipEntryLoadFailedEventPayload = MediaFileEventPayload<
  ZipEntryLoadFailedAttributes,
  'zipEntryLoadFailed'
>;

export const createZipEntryLoadFailedEvent = (
  fileState: FileState,
  error: MediaViewerError,
  zipEntry?: ZipEntry,
): ZipEntryLoadFailedEventPayload => {
  const { fileId, fileMediatype, fileMimetype, fileSize, fileStatus } =
    getFileAttributes(fileState);
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    action: 'zipEntryLoadFailed',
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
        fileStatus,
      },
      size: zipEntry ? zipEntry.size : -1,
      encrypted: zipEntry ? zipEntry.encrypted : false,
      compressedSize: zipEntry ? zipEntry.compressedSize : -1,
      mimeType: zipEntry ? getMimeTypeFromFilename(zipEntry.name) : 'undefined',
    },
  };
};
