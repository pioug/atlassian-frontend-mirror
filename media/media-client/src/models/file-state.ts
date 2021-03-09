import { FileStatus as CommonFileStatus } from '@atlaskit/media-common';
import { MediaStoreResponse } from '../client/media-store';
import { MediaFileArtifacts } from './artifacts';
import {
  MediaCollectionItemFullDetails,
  MediaFile,
  MediaRepresentations,
  MediaType,
} from './media';

export type FileStatus = CommonFileStatus;

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
  createdAt?: number;
}

export interface PreviewableFileState {
  preview: FilePreview | Promise<FilePreview>;
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
  createdAt?: number;
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
  createdAt?: number;
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
  createdAt?: number;
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

export type NonErrorFileState = Exclude<FileState, ErrorFileState>;

export const isUploadingFileState = (
  fileState: FileState,
): fileState is UploadingFileState => fileState.status === 'uploading';

export const isProcessingFileState = (
  fileState: FileState,
): fileState is ProcessingFileState => fileState.status === 'processing';

export const isProcessedFileState = (
  fileState: FileState,
): fileState is ProcessedFileState => fileState.status === 'processed';

export const isErrorFileState = (
  fileState: FileState,
): fileState is ErrorFileState => fileState.status === 'error';

export const isPreviewableFileState = (
  fileState: FileState,
): fileState is Exclude<FileState, ErrorFileState> & PreviewableFileState =>
  !isErrorFileState(fileState) && !!fileState.preview;

export const isFinalFileState = (
  fileState: FileState,
): fileState is ProcessedFileState | ErrorFileState | ProcessingFailedState =>
  ['processed', 'failed-processing', 'error'].includes(fileState.status);

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
    createdAt,
  } = mediaFile.data;
  const baseState = {
    id,
    name,
    size,
    mediaType,
    mimeType,
    artifacts,
    representations,
    createdAt,
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
