import { MediaCardCursor } from '../types';
import { MediaType } from '@atlaskit/media-client';

export const getMediaCardCursor = (
  useInlinePlayer: boolean,
  useMediaViewer: boolean,
  isErrorStatus: boolean,
  hasCardPreview: boolean,
  mediaType?: MediaType,
): MediaCardCursor => {
  // If error status or no action is requested = NoAction
  if (isErrorStatus || (!useInlinePlayer && !useMediaViewer)) {
    return MediaCardCursor.NoAction;
  }

  if (!mediaType && (useInlinePlayer || (useInlinePlayer && useMediaViewer))) {
    return MediaCardCursor.NotReady;
  } else if (mediaType === 'video' && hasCardPreview && useInlinePlayer) {
    return MediaCardCursor.Action;
  }

  if (useMediaViewer) {
    return MediaCardCursor.Action;
  }

  return MediaCardCursor.NoAction;
};
