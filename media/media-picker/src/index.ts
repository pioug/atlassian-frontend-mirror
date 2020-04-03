import { MediaClientConfig } from '@atlaskit/media-core';
import { PopupConfig, Popup } from './types';
export { isImagePreview } from './domain/preview';

export async function MediaPicker(
  mediaClientConfig: MediaClientConfig,
  pickerConfig: PopupConfig,
): Promise<Popup> {
  const [{ PopupImpl }, { getMediaClient }] = await Promise.all([
    import(
      /* webpackChunkName:"@atlaskit-internal_media-picker-popup" */ './components/popup'
    ),
    import(
      /* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'
    ),
  ]);

  const mediaClient = getMediaClient(mediaClientConfig);

  return new PopupImpl(mediaClient, pickerConfig);
}

// REACT COMPONENTS

export { DropzoneLoader as Dropzone } from './components/dropzone';
export { ClipboardLoader as Clipboard } from './components/clipboard';
export { BrowserLoader as Browser } from './components/browser';
