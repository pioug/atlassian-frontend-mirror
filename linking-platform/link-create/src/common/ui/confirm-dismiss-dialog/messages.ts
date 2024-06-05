import { defineMessages } from 'react-intl-next';

export default defineMessages({
	title: {
		id: 'linkCreate.confirm-dismiss-dialog.modal.title',
		defaultMessage: 'Your changes won’t be saved',
		description: 'Title for confirm-dismiss modal popup',
	},
	cancelButtonLabel: {
		id: 'linkCreate.confirm-dismiss-dialog.modal.cancel-button-label',
		defaultMessage: 'Go back',
		description: 'Label for secondary button for confirm-dismiss modal popup',
	},
	confirmButtonLabel: {
		id: 'linkCreate.confirm-dismiss-dialog.modal.confirm-button-label',
		defaultMessage: 'Discard',
		description: 'Label for primary button for confirm-dismiss modal popup',
	},
	description: {
		id: 'linkCreate.confirm-dismiss-dialog.modal.description',
		defaultMessage: 'We won’t be able to save your information if you move away from this page.',
		description: 'Description for confirm-dismiss modal popup',
	},
});
