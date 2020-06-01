// Based on https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
export const isImageMimeTypeSupportedByBrowser = (mimeType: string) =>
  [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/x-icon',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ].indexOf(mimeType.toLowerCase()) > -1;

export const isDocumentMimeTypeSupportedByBrowser = (mimeType: string) =>
  mimeType.toLowerCase() === 'application/pdf';

// For backward compatilbity, we consider all audio files as natively supported
export const isAudioMimeTypeSupportedByBrowser = (mimeType: string) =>
  mimeType.indexOf('audio/') === 0;

/**
 * For backward compatilbity, we assume MP4/MOV is natively supported.
 * TODO: Improve detection of supported video formats by the browser.
 *
 * See related tickets:
 * - https://product-fabric.atlassian.net/browse/MPT-503
 * - https://product-fabric.atlassian.net/browse/MPT-477
 * - https://product-fabric.atlassian.net/browse/MPT-475
 * - https://product-fabric.atlassian.net/browse/EDM-633
 * - https://product-fabric.atlassian.net/browse/EDM-426
 */
export const isVideoMimeTypeSupportedByBrowser = (mimeType: string) =>
  ['video/mp4', 'video/quicktime'].indexOf(mimeType.toLowerCase()) > -1;

export const isMimeTypeSupportedByBrowser = (mimeType: string) =>
  isDocumentMimeTypeSupportedByBrowser(mimeType) ||
  isImageMimeTypeSupportedByBrowser(mimeType) ||
  isAudioMimeTypeSupportedByBrowser(mimeType) ||
  isVideoMimeTypeSupportedByBrowser(mimeType);
