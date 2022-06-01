import { MediaCardCursor } from '../types';
import { MediaType } from '@atlaskit/media-client';

/**
 * When the returned value is undefined, we'd expect the media card to take the parent's cursor style.
 */

export const getMediaCardCursor = (
  useInlinePlayer: boolean,
  useMediaViewer: boolean,
  isErrorStatus: boolean,
  hasCardPreview: boolean,
  mediaType?: MediaType,
): MediaCardCursor | undefined => {
  // If error status or no action is requested = NoAction
  if (isErrorStatus || (!useInlinePlayer && !useMediaViewer)) {
    return;
  }

  if (!mediaType && (useInlinePlayer || (useInlinePlayer && useMediaViewer))) {
    return MediaCardCursor.NotReady;
  } else if (mediaType === 'video' && hasCardPreview && useInlinePlayer) {
    return MediaCardCursor.Action;
  }

  if (useMediaViewer) {
    return MediaCardCursor.Action;
  }

  return;
};
