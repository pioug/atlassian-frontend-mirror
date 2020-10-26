import { fakeImage } from '../../utils/mockData';

export const notifyMetadataPayload = (
  tenantFileId: string,
  fileSize: number,
) => ({
  type: 'NotifyMetadata',
  uploadId: tenantFileId,
  metadata: {
    pending: false,
    preview: {
      url: fakeImage,
      width: 320,
      height: 240,
      size: fileSize,
    },
    original: {
      url: fakeImage,
      width: 320,
      height: 240,
      size: fileSize,
    },
  },
});

export const remoteUploadStartPayload = (tenantFileId: string) => ({
  type: 'RemoteUploadStart',
  uploadId: tenantFileId,
});

export const remoteUploadProgressPayload = (
  tenantFileId: string,
  fileSize: number,
) => ({
  type: 'RemoteUploadProgress',
  uploadId: tenantFileId,
  currentAmount: fileSize,
  totalAmount: fileSize,
});

export const remoteUploadEndPayload = (
  tenantFileId: string,
  userFileId: string,
) => ({
  type: 'RemoteUploadEnd',
  uploadId: tenantFileId,
  fileId: userFileId,
});
