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
  assistiveTextSuggestionsDefault: {
    id: 'fabric.editor.elementbrowser.searchbar.assistive.text.suggestions',
    defaultMessage: '{count} suggestions available by default.',
    description: 'Assistive text to describe the default list of suggestions',
  },
  assistiveTextSuggestions: {
    id: 'fabric.editor.elementbrowser.searchbar.assistive.text.suggestions',
    defaultMessage: '{count} suggestions available for typed text.',
    description:
      'Assistive text to describe the list of suggestions filtered by typed user input, plural of fabric.editor.elementbrowser.searchbar.assistive.text.suggestion',
  },
  assistiveTextSuggestion: {
    id: 'fabric.editor.elementbrowser.searchbar.assistive.text.suggestion',
    defaultMessage: '{count} suggestion available for typed text.',
    description:
      'Assistive text to describe the that there is one suggestion for the users typed input',
  },
  assistiveTextSuggestionNothing: {
    id: 'fabric.editor.elementbrowser.searchbar.assistive.text.nothing',
    defaultMessage: 'Nothing matches your search',
    description:
      'Assistive text to describe that no suggestions match the users typed input',
  },
});
