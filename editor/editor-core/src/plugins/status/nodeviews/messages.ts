import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.statusPlaceholder',
    defaultMessage: 'Set a status',
    description:
      'Placeholder description for an empty (new) status item in the editor',
  },
  editText: {
    id: 'fabric.editor.editStatusText',
    defaultMessage: 'Edit Status',
    description: 'Title for the input that changes the status text',
  },
  editColor: {
    id: 'fabric.editor.editStatusColor',
    defaultMessage: 'Edit Status Color',
    description: 'Title for the color picker that changes the status color',
  },
});
