import { ImageMetadata } from '@atlaskit/media-client';

export interface WsErrorData {
  type: 'Error';
  error: 'ServerError' | 'RemoteUploadFail' | 'NoUserFound';
  reason: string;
}

export interface WsUploadMessageData {
  type:
    | 'RemoteUploadStart'
    | 'RemoteUploadProgress'
    | 'RemoteUploadEnd'
    | 'NotifyMetadata'
    | 'Error';
  // This `uploadId` has nothing to do with real uploadId that was using to upload remote file into
  // user's "recents" collection. This `uploadId` will actually contain value that is being give
  // during `fetchFile` message as `jobId` parameter. To make it even more fun, the value being stored here
  // is actually a tenant fileId we created beforehand. See importFiles.tsx for more.
  uploadId: string;
}

export interface WsRemoteUploadFailData
  extends WsUploadMessageData,
    WsErrorData {
  type: 'Error';
  error: 'RemoteUploadFail';
}

export interface WsRemoteUploadStartData extends WsUploadMessageData {
  type: 'RemoteUploadStart';
}

export interface WsRemoteUploadProgressData extends WsUploadMessageData {
  type: 'RemoteUploadProgress';
  currentAmount: number;
  totalAmount: number;
}

export interface WsRemoteUploadEndData extends WsUploadMessageData {
  type: 'RemoteUploadEnd';
  // This will hold actual user's fileId
  fileId: string;
}

export interface WsNotifyMetadata extends WsUploadMessageData {
  type: 'NotifyMetadata';
  metadata: ImageMetadata;
}

export type WsMessageData = WsUploadMessageData | WsErrorData;

export const isRemoteUploadStartData = (
  data: WsMessageData,
): data is WsRemoteUploadStartData => {
  return data && data.type === 'RemoteUploadStart';
};

export const isRemoteUploadProgressData = (
  data: WsUploadMessageData,
): data is WsRemoteUploadProgressData => {
  return data.type === 'RemoteUploadProgress';
};

export const isRemoteUploadEndData = (
  data: WsUploadMessageData,
): data is WsRemoteUploadEndData => {
  return data.type === 'RemoteUploadEnd';
};

const isErrorData = (data: WsMessageData): data is WsErrorData => {
  return data.type === 'Error';
};

export const isRemoteUploadErrorData = (
  data: WsUploadMessageData,
): data is WsRemoteUploadFailData => {
  return isErrorData(data) && data.error === 'RemoteUploadFail';
};

export const isNotifyMetadata = (
  data: WsUploadMessageData,
): data is WsNotifyMetadata => {
  return data.type === 'NotifyMetadata';
};
