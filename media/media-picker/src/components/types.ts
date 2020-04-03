import { LocalUploadComponent } from './localUpload';
import { UploadEventPayloadMap, UploadParams } from '../types';
import { UploadComponent, UploadEventEmitter } from './component';

export interface LocalUploadConfig {
  uploadParams: UploadParams; // This is tenant upload params
  shouldCopyFileToRecents?: boolean;
}

export interface LocalUploadComponent<
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends UploadComponent<M> {
  cancel(uniqueIdentifier?: string): void;
  setUploadParams(uploadParams: UploadParams): void;
}

export interface PopupUploadEventEmitter extends UploadEventEmitter {
  emitClosed(): void;
}

export interface DropzoneDragEnterEventPayload {
  length: number;
}

export interface DropzoneDragLeaveEventPayload {
  length: number;
}

export type DropzoneUploadEventPayloadMap = UploadEventPayloadMap & {
  readonly drop: undefined;
  readonly 'drag-enter': DropzoneDragEnterEventPayload;
  readonly 'drag-leave': DropzoneDragLeaveEventPayload;
};
