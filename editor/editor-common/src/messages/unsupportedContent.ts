import { defineMessages } from 'react-intl';

export const unsupportedContentMessages = defineMessages({
  unsupportedInlineContent: {
    id: 'fabric.editor.unsupportedInlineContent',
    defaultMessage: 'Unsupported content',
    description: 'Unsupported content',
  },
  unsupportedBlockContent: {
    id: 'fabric.editor.unsupportedBlockContent',
    defaultMessage: 'This editor does not support displaying this content',
    description: 'This editor does not support displaying this content',
  },
  unsupportedContentTooltip: {
    id: 'fabric.editor.unsupportedContentTooltip',
    defaultMessage:
      'Content is not available in this editor, this will be preserved when you edit and save',
    description:
      'Content is not available in this editor, this will be preserved when you edit and save',
  },
});
