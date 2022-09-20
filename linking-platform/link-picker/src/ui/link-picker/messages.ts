import { defineMessages } from 'react-intl-next';

export const searchMessages = defineMessages({
  linkLabel: {
    id: 'fabric.linkPicker.search.linkLabel',
    defaultMessage: 'Search or paste a link',
    description: 'Label for the link input',
  },
  linkAriaLabel: {
    id: 'fabric.linkPicker.search.linkAriaLabel',
    defaultMessage: 'Suggestions will appear below as you type into the field',
    description: 'Aria label for the link input',
  },
  linkPlaceholder: {
    id: 'fabric.linkPicker.search.linkPlaceholder',
    defaultMessage: 'Find recent links or paste a new link',
    description: 'Placeholder text for the link input',
  },
});

export const linkMessages = defineMessages({
  linkLabel: {
    id: 'fabric.linkPicker.linkLabel',
    defaultMessage: 'Link',
    description: 'Label for the link input',
  },
  linkAriaLabel: {
    id: 'fabric.linkPicker.linkAriaLabel',
    defaultMessage: 'Type or paste a link into the field',
    description: 'Aria label for the link input',
  },
  linkPlaceholder: {
    id: 'fabric.linkPicker.linkPlaceholder',
    defaultMessage: 'Paste a link',
    description: 'Placeholder text for the link input',
  },
});

export const formMessages = defineMessages({
  linkInvalid: {
    id: 'fabric.linkPicker.linkInvalid',
    defaultMessage: 'Enter a valid URL.',
    description: 'Error message shown for invalid links',
  },
  clearLink: {
    id: 'fabric.linkPicker.clearLink',
    defaultMessage: 'Clear link',
    description: 'Tooltip message for link input clear button',
  },
});

export const linkTextMessages = defineMessages({
  linkTextLabel: {
    id: 'fabric.linkPicker.linkTextLabel',
    defaultMessage: 'Add a description (optional)',
    description: 'Label for the link description input',
  },
  linkTextAriaLabel: {
    id: 'fabric.linkPicker.linkTextAriaLabel',
    defaultMessage: 'Link description',
    description: 'Aria label for the link description input',
  },
  linkTextPlaceholder: {
    id: 'fabric.linkPicker.linkTextPlaceholder',
    defaultMessage: 'Give this link a title or description',
    description: 'Placeholder text for the link description input',
  },
  clearLinkText: {
    id: 'fabric.linkPicker.clearLinkText',
    defaultMessage: 'Clear text',
    description: 'Tooltip message for link input clear button',
  },
});

export const messages = defineMessages({
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
