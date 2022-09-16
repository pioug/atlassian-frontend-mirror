// Common Translations will live here
import { defineMessages } from 'react-intl-next';
import commonMessages, { linkMessages } from '@atlaskit/editor-common/messages';
import { messages as statusMessages } from './plugins/status/nodeviews/messages';
import { messages as dateMessages } from './plugins/date/nodeviews/messages';

export { linkMessages };
export { statusMessages };
export { dateMessages };

export const linkToolbarMessages = defineMessages({
  addLink: {
    id: 'fabric.editor.mediaAddLink',
    defaultMessage: 'Add link',
    description: 'Add link',
  },
  unableToOpenLink: {
    id: 'fabric.editor.unableToOpenLink',
    defaultMessage: 'Unable to open this link',
    description: 'Unable to open this link',
  },
  unlink: {
    id: 'fabric.editor.unlink',
    defaultMessage: 'Unlink',
    description: 'Removes the hyperlink but keeps your text.',
  },
  editLink: {
    id: 'fabric.editor.editLink',
    defaultMessage: 'Edit link',
    description: 'Edit the link, update display text',
  },
  placeholder: {
    id: 'fabric.editor.hyperlinkToolbarPlaceholder',
    defaultMessage: 'Paste or search for link',
    description: 'Paste or search for link',
  },
  linkPlaceholder: {
    id: 'fabric.editor.linkPlaceholder',
    defaultMessage: 'Paste link',
    description: 'Create a new link by pasting a URL.',
  },
  linkAddress: {
    id: 'fabric.editor.linkAddress',
    defaultMessage: 'Link address',
    description: 'Insert the address of the link',
  },
  invalidLink: {
    id: 'fabric.editor.invalidLink',
    defaultMessage: 'Please enter a valid link.',
    description: 'Please enter a valid link.',
  },
  emptyLink: {
    id: 'fabric.editor.emptyLink',
    defaultMessage: 'Please enter a link.',
    description: 'Please enter a link.',
  },
  settingsLink: {
    id: 'fabric.editor.settingsLinks',
    defaultMessage: 'Go to Link Preferences',
    description: 'Go to Link Preferences',
  },
});

export default commonMessages;
