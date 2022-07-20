import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  placeholder: {
    id: 'fabric.linkPicker.hyperlinkToolbarPlaceholder',
    defaultMessage: 'Search or paste a link',
    description: 'Search or paste a link',
  },
  linkPlaceholder: {
    id: 'fabric.linkPicker.linkPlaceholder',
    defaultMessage: 'Paste link',
    description: 'Create a new link by pasting a URL.',
  },
  linkTextPlaceholder: {
    id: 'fabric.linkPicker.linkTextPlaceholder',
    defaultMessage: 'Add a description',
    description: 'Text to display',
  },
  linkLabel: {
    id: 'fabric.linkPicker.linkAddress',
    defaultMessage: 'Link',
    description: 'Link Label',
  },
  linkInvalid: {
    id: 'fabric.linkPicker.linkInvalid',
    defaultMessage: 'Enter a valid URL.',
    description: 'Input Error the URL is invalid',
  },
  linkTextLabel: {
    id: 'fabric.linkPicker.displayText',
    defaultMessage: 'Link text',
    description: 'Link text label',
  },
  clearText: {
    id: 'fabric.linkPicker.clearLinkText',
    defaultMessage: 'Clear text',
    description: 'Clears text on the link toolbar',
  },
  clearLink: {
    id: 'fabric.linkPicker.clearLink',
    defaultMessage: 'Clear link',
    description: 'Clears link in the link toolbar',
  },
  searchLinkAriaDescription: {
    id: 'fabric.linkPicker.hyperlink.searchLinkAriaDescription',
    defaultMessage: 'Suggestions will appear below as you type into the field',
    description:
      'Describes what the search field does for screen reader users.',
  },
  searchLinkResults: {
    id: 'fabric.linkPicker.hyperlink.searchLinkResults',
    defaultMessage:
      '{count, plural, =0 {no results} one {# result} other {# results}} found',
    description: 'Announce search results for screen-reader users.',
  },
  linkAriaLabel: {
    id: 'fabric.linkPicker.hyperlink.linkAriaLabel',
    defaultMessage: 'Link label',
    description: 'aria label for a link',
  },
  timeUpdated: {
    id: 'fabric.linkPicker.time.updated',
    defaultMessage: 'Updated',
    description: 'Time last updated',
  },
  timeViewed: {
    id: 'fabric.linkPicker.time.viewed',
    defaultMessage: 'Viewed',
    description: 'Time last viewed',
  },
  timeAgo: {
    id: 'fabric.linkPicker.time.ago',
    defaultMessage: 'ago',
    description: 'Some time ago',
  },
  titleRecentlyViewed: {
    id: 'fabric.linkPicker.listTitle.recentlyViewed',
    defaultMessage: 'Recently Viewed',
    description:
      'Describes type of items shown in the list for screen-reader users',
  },
  titleResults: {
    id: 'fabric.linkPicker.listTitle.results',
    defaultMessage: 'Results',
    description:
      'Describes type of items shown in the list for screen-reader users',
  },
  cancelButton: {
    id: 'fabric.linkPicker.button.cancel',
    defaultMessage: 'Cancel',
    description: 'Button to cancel and dismiss the link picker',
  },
  insertButton: {
    id: 'fabric.linkPicker.button.insert',
    defaultMessage: 'Insert',
    description: 'Button to insert searched or selected link',
  },
  noResults: {
    id: 'fabric.linkPicker.search.noResults.heading',
    defaultMessage: 'We couldn’t find anything matching your search.',
    description: 'Heading message shown when a search has no results',
  },
  noResultsDescription: {
    id: 'fabric.linkPicker.search.noResults.description',
    defaultMessage: 'Try again with a different term.',
    description: 'Describes possible action when a search returns no results',
  },
  saveButton: {
    id: 'fabric.linkPicker.button.save',
    defaultMessage: 'Save',
    description: 'Button to save edited link',
  },
});
