import { defineMessages } from 'react-intl-next';

export const mediaResizeAnnouncerMessMessages = defineMessages({
  MediaWidthIsMax: {
    id: 'fabric.editor.media.pixelEntry.MediaWidthIsMax',
    defaultMessage: 'Media increased to the maximum size',
    description: 'The media has the maximum allowed width',
  },
  MediaWidthIsMin: {
    id: 'fabric.editor.media.MediaWidthIsMin',
    defaultMessage: 'Media decreased to the minimum size',
    description: 'The media has the minimum allowed width',
  },
  DefaultMediaWidthIncreased: {
    id: 'fabric.editor.media.DefaultMediaWidthIncreased',
    defaultMessage:
      '{newMediaWidth, plural, one {Media width increased to # pixel.} other {Media width increased to # pixels.}}',
    description: 'Media width increased to {newMediaWidth} pixels.',
  },
  DefaultMediaWidthDecreased: {
    id: 'fabric.editor.media.DefaultMediaWidthDecreased',
    defaultMessage:
      '{newMediaWidth, plural, one {Media width decreased to # pixel.} other {Media width decreased to # pixels.}}',
    description: 'Media width decreased to {newMediaWidth} pixels.',
  },
});
