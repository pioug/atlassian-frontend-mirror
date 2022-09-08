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
});
