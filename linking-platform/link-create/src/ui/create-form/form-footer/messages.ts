import { defineMessages } from 'react-intl';

export const messages: {
	close: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	create: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	close: {
		id: 'linkCreate.createForm.button.close',
		defaultMessage: 'Close',
		description: 'Button to close and dismiss link create',
	},
	create: {
		id: 'linkCreate.createForm.button.create',
		defaultMessage: 'Create',
		description: 'Button to submit the form and Create object',
	},
});
