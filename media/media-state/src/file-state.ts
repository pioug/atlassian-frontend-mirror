import { type MediaTraceContext, type MediaType } from '@atlaskit/media-common';

export type MediaFileProcessingStatus = 'pending' | 'succeeded' | 'failed';

export type MediaRepresentations = {
  image?: Object;
};

export type MediaFileArtifact = {
  readonly url: string;
  readonly processingStatus: MediaFileProcessingStatus;
  readonly cdnUrl?: string;
};

export interface MediaFileArtifacts {
  'image.png'?: MediaFileArtifact;
  'image.jpg'?: MediaFileArtifact;
  'image.gif'?: MediaFileArtifact;
  'image.webp'?: MediaFileArtifact;
  'thumb.jpg'?: MediaFileArtifact;
  'thumb_120.jpg'?: MediaFileArtifact;
  'thumb_320.jpg'?: MediaFileArtifact;
  'thumb_large.jpg'?: MediaFileArtifact;
  'document.pdf'?: MediaFileArtifact;
  'document.txt'?: MediaFileArtifact;
  'audio.mp3'?: MediaFileArtifact;
  'video.mp4'?: MediaFileArtifact;
  'video_640.mp4'?: MediaFileArtifact;
  'video_1280.mp4'?: MediaFileArtifact;
  'video_hd.mp4'?: MediaFileArtifact;
  'poster.jpg'?: MediaFileArtifact;
  'poster_640.jpg'?: MediaFileArtifact;
  'poster_1280.jpg'?: MediaFileArtifact;
  'poster_hd.jpg'?: MediaFileArtifact;
}

type BaseFileState = {
  id: string;
  occurrenceKey?: string;
  metadataTraceContext?: MediaTraceContext;
};

type NonErrorBaseFileState = {
  name: string;
  size: number;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview | Promise<FilePreview>;
  createdAt?: number;
} & BaseFileState;

export interface FilePreview {
  value: Blob | string;
  origin?: 'local' | 'remote';
  originalDimensions?: {
    width: number;
    height: number;
  };
}
export interface UploadingFileState extends NonErrorBaseFileState {
  status: 'uploading';
  progress: number;
}

export interface ProcessingFileState extends NonErrorBaseFileState {
  status: 'processing';
  artifacts?: MediaFileArtifacts;
  representations?: MediaRepresentations;
}

export interface ProcessedFileState extends NonErrorBaseFileState {
  status: 'processed';
  artifacts: MediaFileArtifacts;
  representations?: MediaRepresentations;
}
export interface ProcessingFailedState extends NonErrorBaseFileState {
  status: 'failed-processing';
  artifacts: Object;
  representations?: MediaRepresentations;
}
export interface ErrorFileState extends BaseFileState {
  status: 'error';
  id: string;
  reason?: string;
  message?: string;
  details?: Record<string, any>;
}
export type FileState =
  | UploadingFileState
  | ProcessingFileState
  | ProcessedFileState
  | ErrorFileState
  | ProcessingFailedState;
