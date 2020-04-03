import { MediaType } from '..';

export const getMediaTypeFromMimeType = (type: string): MediaType => {
  if (type.indexOf('image/') === 0) {
    return 'image';
  } else if (type.indexOf('video/') === 0) {
    return 'video';
  } else if (type.indexOf('audio/') === 0) {
    return 'audio';
  } else if (['application/pdf', 'text/plain'].indexOf(type) >= 0) {
    return 'doc';
  } else {
    return 'unknown';
  }
};
