import { MediaClientConfig } from '@atlaskit/media-core';
import { PopupConfig, Popup } from './types';
export { isImagePreview } from './domain/preview';

export async function MediaPicker(
  mediaClientConfig: MediaClientConfig,
  pickerConfig: PopupConfig,
): Promise<Popup> {
  const [{ PopupImpl }, { getMediaClient }] = await Promise.all([
    import(
      /* webpackChunkName: "@atlaskit-internal_media-picker-popup" */ './components/popup'
    ),
    import(
      /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
    ),
  ]);

  const mediaClient = getMediaClient(mediaClientConfig);

  return new PopupImpl(mediaClient, pickerConfig);
}

export type {
  BrowserConfig,
  DropzoneConfig,
  UploadParams,
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  MediaFile,
  Preview,
  NonImagePreview,
  ImagePreview,
  MediaError,
  MediaErrorName,
} from './types';
export type { LocalUploadConfig } from './components/types';

// REACT COMPONENTS

export { DropzoneLoader as Dropzone } from './components/dropzone';
export { ClipboardLoader as Clipboard } from './components/clipboard';
export { BrowserLoader as Browser } from './components/browser';
