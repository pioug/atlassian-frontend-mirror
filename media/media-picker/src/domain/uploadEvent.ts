import { UploadEventPayloadMap } from '../types';

export type UploadEventMap = {
  readonly [K in keyof UploadEventPayloadMap]: {
    readonly name: K;
    readonly data: UploadEventPayloadMap[K];
  };
};

export type UploadEventName = keyof UploadEventMap;
export type UploadEvent = UploadEventMap[UploadEventName];
export type UploadErrorEvent = UploadEventMap['upload-error'];
