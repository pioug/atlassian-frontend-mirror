import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  editText: {
    id: 'fabric.editor.editDateText',
    defaultMessage: 'Edit Date',
    description: 'Title for the input that changes the date',
  },
  invalidDateError: {
    id: 'fabric.editor.invalidDateError',
    defaultMessage: 'Enter a valid date',
    description:
      'Error message when the date typed in is invalid, requesting they inputs a new date',
  },
});
