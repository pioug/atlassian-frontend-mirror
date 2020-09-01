import { UploadEventPayloadMap, UploadParams } from '../types';
import { UploadEventEmitter } from './component';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

export interface LocalUploadConfig {
  uploadParams: UploadParams; // This is tenant upload params
  shouldCopyFileToRecents?: boolean;
  featureFlags?: MediaFeatureFlags;
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
