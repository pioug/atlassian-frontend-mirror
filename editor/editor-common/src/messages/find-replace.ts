import { defineMessages } from 'react-intl-next';

export const findReplaceMessages = defineMessages({
  find: {
    id: 'fabric.editor.find',
    defaultMessage: 'Find',
    description: 'The word or phrase to search for on the document',
  },
  matchCase: {
    id: 'fabric.editor.matchCase',
    defaultMessage: 'Match case',
    description:
      'Toggle whether should also match case when searching for text',
  },
  findNext: {
    id: 'fabric.editor.findNext',
    defaultMessage: 'Find next',
    description:
      'Locate the next occurrence of the word or phrase that was searched for',
  },
  findPrevious: {
    id: 'fabric.editor.findPrevious',
    defaultMessage: 'Find previous',
    description:
      'Locate the previous occurrence of the word or phrase that was searched for',
  },
  closeFindReplaceDialog: {
    id: 'fabric.editor.closeFindReplaceDialog',
    defaultMessage: 'Close',
    description: 'Cancel search and close the "Find and Replace" dialog',
  },
  noResultsFound: {
    id: 'fabric.editor.noResultsFound',
    defaultMessage: 'No results',
    description:
      'No matches were found for the word or phrase that was searched for',
  },
  resultsCount: {
    id: 'fabric.editor.resultsCount',
    description:
      'Text for selected search match position and total results count',
    defaultMessage: '{selectedMatchPosition} of {totalResultsCount}',
  },
  findReplaceToolbarButton: {
    id: 'fabric.editor.findReplaceToolbarButton',
    defaultMessage: 'Find and replace',
    description:
      '"Find" highlights all instances of a word or phrase on the document, and "Replace" changes one or all of those instances to something else',
  },
  replaceWith: {
    id: 'fabric.editor.replaceWith',
    defaultMessage: 'Replace with',
    description:
      'The value that will replace the word or phrase that was searched for',
  },
  replace: {
    id: 'fabric.editor.replace',
    defaultMessage: 'Replace',
    description:
      'Replace only the currently selected instance of the word or phrase',
  },
  replaceAll: {
    id: 'fabric.editor.replaceAll',
    defaultMessage: 'Replace all',
    description:
      'Replace all instances of the word or phrase throughout the entire document',
  },
  replaceSuccess: {
    id: 'fabric.editor.replaceSuccess',
    defaultMessage:
      '{numberOfMatches, plural, one {# match replaced} other {# matches replaced}}',
    description: 'Text when replacement succesfully done',
  },
});
