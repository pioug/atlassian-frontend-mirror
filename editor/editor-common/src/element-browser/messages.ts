import { defineMessages } from 'react-intl-next';
export default defineMessages({
  elementAfterInputMessage: {
    id: 'fabric.editor.elementbrowser.searchbar.elementAfterInput',
    defaultMessage: 'Enter',
    description: 'Enter to insert',
  },
  placeHolderMessage: {
    id: 'fabric.editor.elementbrowser.searchbar.placeholder',
    defaultMessage: 'Search',
    description: 'Search field placeholder',
  },
  assistiveTextDefault: {
    id: 'fabric.editor.elementbrowser.searchbar.assistive.text.default',
    defaultMessage: '{count} suggestions available by default.',
    description: 'Assistive text to describe the default list of suggestions',
  },
  assistiveTextResult: {
    id: 'fabric.editor.elementbrowser.searchbar.assistive.text.result',
    defaultMessage:
      '{count, plural, =0 {Nothing matches your search} one {{count} suggestion available for typed text.} other {{count} suggestions available for typed text.}}',
    description:
      'Assistive text to describe the list of suggestions filtered by typed user input',
  },
});
