import { defineMessages } from 'react-intl-next';

export const columnPickerMessages = defineMessages({
  maximumItemsShownLine1: {
    id: 'linkDataSource.column-picker.no-all-items-shown-message.line-1',
    description:
      'First line of the messages shown at the bottom of column dropdown options explaining why not all available options are shown and how to get to them.',
    defaultMessage: 'Your search returned too many results.',
  },
  maximumItemsShownLine2: {
    id: 'linkDataSource.column-picker.no-all-items-shown-message.line-2',
    description:
      'Second line of the messages shown at the bottom of column dropdown options explaining why not all available options are shown and how to get to them.',
    defaultMessage: 'Try again with more specific keywords.',
  },
  search: {
    id: 'linkDataSource.column-picker.search',
    description: 'Search bar message to look for more fields',
    defaultMessage: 'Search for fields',
  },
});
