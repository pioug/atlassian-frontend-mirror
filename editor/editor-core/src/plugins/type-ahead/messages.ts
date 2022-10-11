import { defineMessages } from 'react-intl-next';

export const typeAheadListMessages = defineMessages({
  typeAheadResultLabel: {
    id: 'fabric.editor.typeAheadResultLabel',
    defaultMessage: 'TypeAhead results',
    description: 'the result of a typeahead, similar to autocomplete results+',
  },
  inputQueryAssistiveLabel: {
    id: 'fabric.editor.inputQueryAssistiveTxt',
    defaultMessage:
      'When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.',
    description: 'Assitive text to the user when using typeahead shortcut',
  },
  searchResultsLabel: {
    id: 'fabric.editor.searchResults',
    defaultMessage:
      '{itemsLength, plural, one {# search result} other {# search results}} available',
    description:
      'Assitive text to the user when using typeahead shortcut and it preceeds with a number - Ex: 10 search results available',
  },
  noSearchResultsLabel: {
    id: 'fabric.editor.noSearchResults',
    defaultMessage: 'No search results',
    description: 'Assitive text to the user when using typeahead shortcut',
  },
});
