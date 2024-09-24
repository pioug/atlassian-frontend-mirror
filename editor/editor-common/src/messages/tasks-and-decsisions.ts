import { defineMessages } from 'react-intl-next';

export const tasksAndDecisionsMessages = defineMessages({
	taskPlaceholder: {
		id: 'fabric.editor.taskPlaceholder',
		defaultMessage: "Type your action, use '@' to assign to someone.",
		description: 'Placeholder description for an empty action/task in the editor',
	},
	decisionPlaceholder: {
		id: 'fabric.editor.decisionPlaceholder',
		defaultMessage: 'Add a decision…',
		description: 'Placeholder description for an empty decision in the editor',
	},
	editAccessTitle: {
		id: 'fabric.editor.editAccessTitle',
		defaultMessage: 'You need edit access',
		description: 'Title in the popup when we click on action item checkbox without edit permission',
	},
	requestToEditDescription: {
		id: 'fabric.editor.requestToEditDescription',
		defaultMessage: 'When you request access, the page owner will receive a notification.',
		description:
			'Description in the popup when we click on action item checkbox without edit permission',
	},
	requestToEdit: {
		id: 'fabric.editor.requestToEdit',
		defaultMessage: 'Request to edit',
		description:
			'Button in the popup when we click on action item checkbox without edit permission',
	},
	dismiss: {
		id: 'fabric.editor.requestToEditDismiss',
		defaultMessage: 'Dismiss',
		description: 'Button in the popup when we click on dismiss without edit permission',
	},
});
