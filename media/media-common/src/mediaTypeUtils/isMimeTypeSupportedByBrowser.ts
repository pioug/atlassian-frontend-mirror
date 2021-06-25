// Based on https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
export const isImageMimeTypeSupportedByBrowser = (mimeType: string) =>
  [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/x-icon',
    'image/jpeg',
    'image/png',
    'image/webp',
    //'image/svg+xml', // Removed because of https://product-fabric.atlassian.net/browse/BMPT-625
  ].indexOf(mimeType.toLowerCase()) > -1;

export const isDocumentMimeTypeSupportedByBrowser = (mimeType: string) =>
  mimeType.toLowerCase() === 'application/pdf';

export const isAudioMimeTypeSupportedByBrowser = (mimeType: string) =>
  [
    'audio/aac',
    'audio/flac',
    'audio/mp4',
    'audio/mpeg',
    'audio/ogg',
    'audio/x-ogg',
    'audio/wav',
    'audio/x-wav',
  ].indexOf(mimeType.toLowerCase()) > -1;

/**
 * For backward compatilbity, we assume MP4/MOV is natively supported.
 * TODO: Improve detection of supported video formats by the browser.
 *
 * See related tickets:
 * - https://product-fabric.atlassian.net/browse/MPT-477
 * - https://product-fabric.atlassian.net/browse/EDM-634
 * - https://product-fabric.atlassian.net/browse/EDM-426
 */
export const isVideoMimeTypeSupportedByBrowser = (mimeType: string) =>
  ['video/mp4', 'video/quicktime'].indexOf(mimeType.toLowerCase()) > -1;

export const isMimeTypeSupportedByBrowser = (mimeType: string) =>
  isDocumentMimeTypeSupportedByBrowser(mimeType) ||
  isImageMimeTypeSupportedByBrowser(mimeType) ||
  isAudioMimeTypeSupportedByBrowser(mimeType) ||
  isVideoMimeTypeSupportedByBrowser(mimeType);
