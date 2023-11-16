import { defineMessages } from 'react-intl-next';

export const mediaResizeAnnouncerMess = defineMessages({
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
  DefaultMediaWidth: {
    id: 'fabric.editor.media.DefaultMediaWidth',
    defaultMessage: 'Media width {action} to {newMediaWidth} pixels.',
    description: 'Media width {action} to {newMediaWidth} pixels.',
  },
  IncreasedAction: {
    id: 'fabric.editor.media.decreased',
    defaultMessage: 'increased',
    description: 'Increased action',
  },
  DecreasedAction: {
    id: 'fabric.editor.media.decreased',
    defaultMessage: 'decreased',
    description: 'Decreased action',
  },
});
