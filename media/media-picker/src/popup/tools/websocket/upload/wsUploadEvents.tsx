import { ImageMetadata } from '@atlaskit/media-client';
import { ServiceName } from '../../../domain';

export interface RemoteUploadBasePayload {
  tenantFileId: string;
  serviceName: ServiceName;
}
export interface RemoteUploadStartPayload extends RemoteUploadBasePayload {}

export interface RemoteUploadProgressPayload extends RemoteUploadBasePayload {
  bytes: number;
  fileSize: number;
}

export interface RemoteUploadEndPayload extends RemoteUploadBasePayload {
  userFileId: string;
}

export interface RemoteUploadFailPayload extends RemoteUploadBasePayload {
  description: string;
}

export interface NotifyMetadataPayload extends RemoteUploadBasePayload {
  metadata: ImageMetadata;
}

export interface WsUploadEvents {
  RemoteUploadStart: RemoteUploadStartPayload;
  RemoteUploadProgress: RemoteUploadProgressPayload;
  RemoteUploadEnd: RemoteUploadEndPayload;
  NotifyMetadata: NotifyMetadataPayload;
  RemoteUploadFail: RemoteUploadFailPayload;
}
