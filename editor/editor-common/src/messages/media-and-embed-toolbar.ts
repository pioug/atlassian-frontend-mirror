import { defineMessages } from 'react-intl-next';

export const toolbarMessages = defineMessages({
  wrapLeft: {
    id: 'fabric.editor.wrapLeft',
    defaultMessage: 'Wrap left',
    description: 'Aligns your image to the left and wraps text around it.',
  },
  wrapRight: {
    id: 'fabric.editor.wrapRight',
    defaultMessage: 'Wrap right',
    description: 'Aligns your image to the right and wraps text around it.',
  },
  changeToMediaSingle: {
    id: 'fabric.editor.media_change_mediasingle',
    defaultMessage: 'Original size',
    description:
      'In the context of a media inline image, it allows the user to convert it to media single',
  },
  changeToMediaInlineImage: {
    id: 'fabric.editor.media_change_mediainline_default',
    defaultMessage: 'Inline',
    description:
      'In the context of media single contains media node, it allows the user to convert media single to media inline image',
  },
  changeToMediaInlineImageCaptionWarning: {
    id: 'fabric.editor.media_change_mediainline_caption_warn',
    defaultMessage: 'Inline (caption will be removed)',
    description:
      'In the context of media single contains media node, it allows the user to convert media single to media inline image and warn user about caption being removed',
  },
});
