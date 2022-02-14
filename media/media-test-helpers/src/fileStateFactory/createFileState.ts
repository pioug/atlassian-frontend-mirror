import { tallImage } from '../';
import { FileState, FileDetails } from '@atlaskit/media-client';

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
    case 'uploading':
      return {
        status: 'uploading',
        progress: 0,
        ...base,
      };
    case 'processing':
      return {
        status: 'processing',
        ...base,
      };
    case 'processed':
      return {
        status: 'processed',
        representations: remotePreview,
        artifacts: {},
        ...base,
      };
    case 'failed-processing':
      return {
        status: 'failed-processing',
        ...base,
      };
    case 'error':
    default:
      return { id, status: 'error' };
  }
};
