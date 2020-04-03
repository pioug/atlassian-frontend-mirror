import {
  MediaFile,
  MediaStoreResponse,
  MediaType,
  MediaFileArtifacts,
  MediaCollectionItemFullDetails,
  MediaRepresentations,
} from '..';

export type FileStatus =
  | 'uploading'
  | 'processing'
  | 'processed'
  | 'error'
  | 'failed-processing';
export interface FilePreview {
  value: Blob | string;
  origin?: 'local' | 'remote';
  originalDimensions?: {
    width: number;
    height: number;
  };
}
export interface PreviewOptions {}
export interface GetFileOptions {
  preview?: PreviewOptions;
  collectionName?: string;
  occurrenceKey?: string;
}
export interface UploadingFileState {
  status: 'uploading';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  progress: number;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview | Promise<FilePreview>;
}
export interface ProcessingFileState {
  status: 'processing';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  artifacts?: MediaFileArtifacts;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview | Promise<FilePreview>;
  representations?: MediaRepresentations;
}

export interface ProcessedFileState {
  status: 'processed';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  artifacts: MediaFileArtifacts;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview | Promise<FilePreview>;
  representations?: MediaRepresentations;
}
export interface ProcessingFailedState {
  status: 'failed-processing';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  artifacts: Object;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview | Promise<FilePreview>;
  representations?: MediaRepresentations;
}
export interface ErrorFileState {
  status: 'error';
  id: string;
  occurrenceKey?: string;
  message?: string;
}
export type FileState =
  | UploadingFileState
  | ProcessingFileState
  | ProcessedFileState
  | ErrorFileState
  | ProcessingFailedState;

export const isErrorFileState = (
  fileState: FileState,
): fileState is ErrorFileState =>
  (fileState as ErrorFileState).status === 'error';

export const isImageRepresentationReady = (fileState: FileState): boolean => {
  switch (fileState.status) {
    case 'processing':
    case 'processed':
    case 'failed-processing':
      return !!(fileState.representations && fileState.representations.image);
    default:
      return false;
  }
};

export const mapMediaFileToFileState = (
  mediaFile: MediaStoreResponse<MediaFile>,
): FileState => {
  const {
    id,
    name,
    size,
    processingStatus,
    artifacts,
    mediaType,
    mimeType,
    representations,
  } = mediaFile.data;
  const baseState = {
    id,
    name,
    size,
    mediaType,
    mimeType,
    artifacts,
    representations,
  };

  switch (processingStatus) {
    case 'pending':
    case undefined:
      return {
        ...baseState,
        status: 'processing',
      };
    case 'succeeded':
      return {
        ...baseState,
        status: 'processed',
      };
    case 'failed':
      return {
        ...baseState,
        status: 'failed-processing',
      };
  }
};

export const mapMediaItemToFileState = (
  id: string,
  item: MediaCollectionItemFullDetails,
): FileState => {
  return mapMediaFileToFileState({
    data: {
      id,
      ...item,
    },
  });
};
