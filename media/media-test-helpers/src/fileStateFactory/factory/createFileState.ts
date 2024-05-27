import { tallImage } from '../..';
import { type FileState, type FileDetails } from '@atlaskit/media-client';

const localPreview = { value: tallImage };
const brokenLocalPreview = { value: 'broken-data-uri' };
const remotePreview = {
  image: {},
};

export type FileStateStatus = FileState['status'];

export type CreateFileStateOptions = {
  withRemotePreview?: boolean;
  withLocalPreview?: boolean;
  withBrokenLocalPreview?: boolean;
  uploadProgress?: number;
  fileDetails?: Partial<FileDetails>;
};

export const createFileState = (
  id: string,
  status: FileStateStatus,
  {
    withRemotePreview,
    withLocalPreview,
    withBrokenLocalPreview,
    uploadProgress,
    fileDetails,
  }: CreateFileStateOptions = {},
): FileState => {
  const extendState: any = {};
  if (uploadProgress) {
    extendState.progress = uploadProgress;
  }
  // REMOTE PREVIEW
  if (withRemotePreview) {
    extendState.representations = remotePreview;
  } else if (withRemotePreview === false) {
    extendState.representations = {};
  }
  // LOCAL PREVIEW
  if (withLocalPreview) {
    extendState.preview = localPreview;
  } else if (withBrokenLocalPreview) {
    extendState.preview = brokenLocalPreview;
  }

  const base = { ...fileDetails, ...extendState, id };
  switch (status) {
    case 'processing':
    case 'failed-processing':
    case 'processed':
      return {
        status,
        ...base,
      };
    case 'uploading':
      return {
        status,
        progress: 0,
        ...base,
      };
    case 'error':
    default:
      return {
        id,
        status: 'error',
        message: 'This is a terrible error with a super long trace',
      };
  }
};
