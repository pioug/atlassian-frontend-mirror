import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  optionsFound: {
    id: 'jql-editor.plugins.autocomplete.options-found',
    defaultMessage: 'Choose from the suggested list of options below.',
    description:
      'This message is read by screen readers when autocomplete suggestions are available in the JQL editor.',
  },
});
