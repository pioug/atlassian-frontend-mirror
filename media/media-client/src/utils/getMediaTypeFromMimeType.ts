import { MediaType } from '../models/media';
import { isArchive } from './isArchive';

import {
  isImageMimeTypeSupportedByBrowser,
  isDocumentMimeTypeSupportedByBrowser,
  isAudioMimeTypeSupportedByBrowser,
  isVideoMimeTypeSupportedByBrowser,
} from './isMimeTypeSupportedByBrowser';

import {
  isImageMimeTypeSupportedByServer,
  isDocumentMimeTypeSupportedByServer,
  isAudioMimeTypeSupportedByServer,
  isVideoMimeTypeSupportedByServer,
} from './isMimeTypeSupportedByServer';

export const getMediaTypeFromMimeType = (mimeType: string): MediaType => {
  if (isArchive(mimeType)) {
    return 'archive';
  }

  if (
    isImageMimeTypeSupportedByBrowser(mimeType) ||
    isImageMimeTypeSupportedByServer(mimeType)
  ) {
    return 'image';
  }

  if (
    isDocumentMimeTypeSupportedByBrowser(mimeType) ||
    isDocumentMimeTypeSupportedByServer(mimeType)
  ) {
    return 'doc';
  }

  if (
    isAudioMimeTypeSupportedByBrowser(mimeType) ||
    isAudioMimeTypeSupportedByServer(mimeType)
  ) {
    return 'audio';
  }

  if (
    isVideoMimeTypeSupportedByBrowser(mimeType) ||
    isVideoMimeTypeSupportedByServer(mimeType)
  ) {
    return 'video';
  }

  return 'unknown';
};
