import { defineMessages } from 'react-intl-next';

export const panelMessages = defineMessages({
	info: {
		id: 'fabric.editor.info',
		defaultMessage: 'Info',
		description: 'Panels provide a way to highlight text. The info panel has a blue background.',
	},
	note: {
		id: 'fabric.editor.note',
		defaultMessage: 'Note',
		description: 'Panels provide a way to highlight text. The note panel has a purple background.',
	},
	success: {
		id: 'fabric.editor.success',
		defaultMessage: 'Success',
		description:
			'Panels provide a way to highlight text. The success panel has a green background.',
	},
	warning: {
		id: 'fabric.editor.warning',
		defaultMessage: 'Warning',
		description:
			'Panels provide a way to highlight text. The warning panel has a yellow background.',
	},
	error: {
		id: 'fabric.editor.error',
		defaultMessage: 'Error',
		description: 'Panels provide a way to highlight text. The error panel has a red background.',
	},
	emoji: {
		id: 'fabric.editor.panel.emoji',
		defaultMessage: 'Add emoji',
		description:
			'The text is shown as a button label on a panel in the editor when the user can add or change the emoji icon displayed on the panel.',
	},
	custom: {
		id: 'fabric.editor.panel.custom',
		defaultMessage: 'Custom',
		description: 'Custom panels where user has selected custom emoji and background color',
	},
	backgroundColor: {
		id: 'fabric.editor.panel.backgroundColor',
		defaultMessage: 'Background color',
		description:
			'The text is shown as a button or menu label in the panel toolbar. Opens a color picker to select the background color for the panel.',
	},
	panelsGroup: {
		id: 'fabric.editor.panel.panelsGroup',
		defaultMessage: 'Panel Types',
		description: 'aria-label for group of panels the floating toolbar',
	},
});
