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
	confirmModalListUnit: {
		id: 'fabric.editor.floatingToolbar.confirmModalConnectedUnit',
		defaultMessage:
			'{name}{amount, plural, =0 {} one { (+1 connected element)} other { (+# connected elements)}}',
		description:
			'Text displayed in confirmation modal which highlights the nodes and the amount of connected nodes that will be deleted',
	},
	confirmDeleteLinkedModalMessage: {
		id: 'fabric.editor.extension.confirmDeleteLinkedModalMessage',
		defaultMessage: 'Deleting {nodeName} will break anything connected to it.',
		description: 'Message for confirm modal when deleting a extension linked to an data consumer.',
	},
	floatingToolbarAriaLabel: {
		id: 'fabric.editor.floatingToolbar.floatingToolbarAriaLabel',
		defaultMessage: 'Floating Toolbar',
		description: "a floating toolbar's aria label",
	},
	floatingToolbarAnnouncer: {
		id: 'fabric.editor.floatingToolbar.floatingToolbarAnnouncer',
		defaultMessage: 'Floating toolbar controls have been opened',
		description:
			'message that will be announced to screenreaders that the floating toolbar is opened',
	},
	floatingToolbarScrollLeft: {
		id: 'fabric.editor.floatingToolbar.scrollLeft',
		defaultMessage: 'Scroll left',
		description: 'Button to scroll left when the toolbar is in the overflow state',
	},
	floatingToolbarScrollRight: {
		id: 'fabric.editor.floatingToolbar.scrollRight',
		defaultMessage: 'Scroll right',
		description: 'Button to scroll right when the toolbar is in the overflow state',
	},
});
