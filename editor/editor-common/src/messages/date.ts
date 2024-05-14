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
  onKeyUpDownText: {
    id: 'fabric.editor.upDown',
    defaultMessage:
      'On the use of up and down arrow keys into the following input field, the date will update below',
    description:
      'The text for the date input informs the user that using the arrow keys (up and down) will update the date picker below',
  },
});
