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
    'image/tiff',
    'image/webp',
  ].indexOf(mimeType.toLowerCase()) > -1;
