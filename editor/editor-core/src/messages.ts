// Common Translations will live here
import { defineMessages } from 'react-intl';
import { linkMessages } from '@atlaskit/editor-common';

export { linkMessages };

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
    defaultMessage: 'Paste link or search recently viewed',
    description: 'Paste link or search recently viewed',
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
    id: 'fabric.editor.invalidLink',
    defaultMessage: 'Please enter a link.',
    description: 'Please enter a link.',
  },
});

export default defineMessages({
  layoutFixedWidth: {
    id: 'fabric.editor.layoutFixedWidth',
    defaultMessage: 'Back to center',
    description:
      'Display your element (image, table, extension, etc) as standard width',
  },
  layoutWide: {
    id: 'fabric.editor.layoutWide',
    defaultMessage: 'Go wide',
    description:
      'Display your element (image, table, extension, etc) wider than normal',
  },
  layoutFullWidth: {
    id: 'fabric.editor.layoutFullWidth',
    defaultMessage: 'Go full width',
    description:
      'Display your element (image, table, extension, etc) as full width',
  },
  alignImageRight: {
    id: 'fabric.editor.alignImageRight',
    defaultMessage: 'Align right',
    description: 'Aligns image to the right',
  },
  alignImageCenter: {
    id: 'fabric.editor.alignImageCenter',
    defaultMessage: 'Align center',
    description: 'Aligns image to the center',
  },
  alignImageLeft: {
    id: 'fabric.editor.alignImageLeft',
    defaultMessage: 'Align left',
    description: 'Aligns image to the left',
  },
  remove: {
    id: 'fabric.editor.remove',
    defaultMessage: 'Remove',
    description:
      'Delete the element (image, panel, table, etc.) from your document',
  },
  visit: {
    id: 'fabric.editor.visit',
    defaultMessage: 'Open link in a new window',
    description: 'Open the link in a new window',
  },
  inviteToEditButtonTitle: {
    id: 'fabric.editor.editMode.inviteToEditButton.title',
    defaultMessage: 'Invite to edit',
    description: 'Invite another user to edit the current document',
  },
  saveButton: {
    id: 'fabric.editor.saveButton',
    defaultMessage: 'Save',
    description: 'Submit and save a comment or document',
  },
  cancelButton: {
    id: 'fabric.editor.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Discard the current comment or document',
  },
});
