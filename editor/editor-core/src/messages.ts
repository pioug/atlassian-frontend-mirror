// Common Translations will live here
import { defineMessages } from 'react-intl';
import { linkMessages } from '@atlaskit/editor-common/messages';
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
  removeEmoji: {
    id: 'fabric.editor.removeEmoji',
    defaultMessage: 'Remove emoji',
    description: 'Remove the emoji panel icon from custom panel',
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
  taskList: {
    id: 'fabric.editor.tooltip.taskList',
    defaultMessage: 'an action item',
    description: 'an action item in the Editor',
  },
  bulletList: {
    id: 'fabric.editor.tooltip.bulletList',
    defaultMessage: 'a list',
    description: 'a list item in the Editor',
  },
  nestedExpand: {
    id: 'fabric.editor.tooltip.nestedExpand',
    defaultMessage: 'a nested expand',
    description: 'expand node which is nested',
  },
  decisionList: {
    id: 'fabric.editor.tooltip.decisionList',
    defaultMessage: 'a decision list',
    description: 'a list of decisions',
  },
  defaultBlockNode: {
    id: 'fabric.editor.tooltip.defaultBlockNode',
    defaultMessage: 'a block node',
    description: 'a block node element',
  },
  panel: {
    id: 'fabric.editor.tooltip.blockPanel',
    defaultMessage: 'a panel',
    description: 'Panel node in the Editor',
  },
  blockquote: {
    id: 'fabric.editor.blockquote',
    defaultMessage: 'a quote',
    description: 'a quote node',
  },
  timeUpdated: {
    id: 'fabric.editor.time.updated',
    defaultMessage: 'Updated',
    description: 'Time last updated',
  },
  timeViewed: {
    id: 'fabric.editor.time.viewed',
    defaultMessage: 'Viewed',
    description: 'Time last viewed',
  },
  timeAgo: {
    id: 'fabric.editor.time.ago',
    defaultMessage: 'ago',
    description: 'Some time ago',
  },
  copyToClipboard: {
    id: 'fabric.editor.copyToClipboard',
    defaultMessage: 'Copy',
    description: 'Copy the whole content of the element to your clipboard',
  },
  copiedToClipboard: {
    id: 'fabric.editor.copiedToClipboard',
    defaultMessage: 'Copied!',
    description: 'Copied the whole content of the element to clipboard',
  },
});
