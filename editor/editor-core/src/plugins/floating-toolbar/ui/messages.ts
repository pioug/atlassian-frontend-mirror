import { defineMessages } from 'react-intl-next';

export default defineMessages({
  confirmModalDefaultHeading: {
    id: 'fabric.editor.floatingToolbar.confirmModalHeading',
    defaultMessage: 'Are you sure?',
    description: 'Default heading of floating toolbar confirmation modal.',
  },
  confirmModalOK: {
    id: 'fabric.editor.floatingToolbar.confirmModalOK',
    defaultMessage: 'OK',
    description: 'OK button for floating toolbar confirmation modal.',
  },
  confirmModalCancel: {
    id: 'fabric.editor.floatingToolbar.confirmModalCancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button for floating toolbar confirmation modal.',
  },
  floatingToolbarAriaLabel: {
    id: 'fabric.editor.floatingToolbar.floatingToolbarAriaLabel',
    defaultMessage: 'Floating Toolbar',
    description: `a floating toolbar's aria label`,
  },
  floatingToolbarAnnouncer: {
    id: 'fabric.editor.floatingToolbar.floatingToolbarAnnouncer',
    defaultMessage: 'Floating toolbar controls have been opened',
    description: `message that will be announced to screenreaders that the floating toolbar is opened`,
  },
});
