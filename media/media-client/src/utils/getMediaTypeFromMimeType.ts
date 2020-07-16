import { MediaType } from '..';

export const getMediaTypeFromMimeType = (type: string): MediaType => {
  if (type.indexOf('image/') === 0) {
    return 'image';
  } else if (type.indexOf('video/') === 0) {
    return 'video';
  } else if (type.indexOf('audio/') === 0) {
    return 'audio';
  } else if (type.indexOf('text/') === 0) {
    return 'doc';
  } else if (
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.presentation',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'application/vnd.visio',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ].indexOf(type) >= 0
  ) {
    return 'doc';
  } else {
    return 'unknown';
  }
};
