import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  info: {
    id: 'fabric.editor.info',
    defaultMessage: 'Info',
    description:
      'Panels provide a way to highlight text. The info panel has a blue background.',
  },
  note: {
    id: 'fabric.editor.note',
    defaultMessage: 'Note',
    description:
      'Panels provide a way to highlight text. The note panel has a purple background.',
  },
  success: {
    id: 'fabric.editor.success',
    defaultMessage: 'Success',
    description:
      'Panels provide a way to highlight text. The success panel has a green background.',
  },
  warning: {
    id: 'fabric.editor.warning',
    defaultMessage: 'Warning',
    description:
      'Panels provide a way to highlight text. The warning panel has a yellow background.',
  },
  error: {
    id: 'fabric.editor.error',
    defaultMessage: 'Error',
    description:
      'Panels provide a way to highlight text. The error panel has a red background.',
  },
  emoji: {
    id: 'fabric.editor.panel.emoji',
    defaultMessage: 'Add emoji',
    description: 'Select the panel icon',
  },
  backgroundColor: {
    id: 'fabric.editor.panel.backgroundColor',
    defaultMessage: 'Background color',
    description: 'Select the panel background color.',
  },
});
