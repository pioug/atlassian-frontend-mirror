import { FilePreview } from './file-state';

export type MobileUploadStartEvent = {
  fileId: string;
  collectionName?: string;
  occurrenceKey?: string;
  fileName: string;
  fileSize: number;
  fileMimetype: string;
  preview?: FilePreview;
  createdAt?: number;
};

export type MobileUploadProgressEvent = {
  fileId: string;
  progress: number; // from 0 to 1
};

export type MobileUploadEndEvent = {
  fileId: string;
};

export type MobileUploadErrorEvent = {
  fileId: string;
  message: string;
};

export interface MobileUpload {
  notifyUploadStart(event: MobileUploadStartEvent): void;
  notifyUploadProgress(event: MobileUploadProgressEvent): void;
  notifyUploadEnd(event: MobileUploadEndEvent): void;
  notifyUploadError(event: MobileUploadErrorEvent): void;
}
