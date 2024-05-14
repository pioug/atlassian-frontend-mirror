import { defineMessages } from 'react-intl-next';

export default defineMessages({
  colorPickerAriaLabel: {
    id: 'jira.color-picker.src.color-picker-aria-label',
    defaultMessage: '{color} selected, {message}',
    description:
      'This text is used as aria-label text in color picker component',
  },
  colorPickerAriaLabelOldFormat: {
    id: 'jira.color-picker.src.color-picker-aria-label-old-format',
    defaultMessage: `{message}, {color} selected`,
    description:
      'This text is used as aria-label text in color picker component',
  },
});
