import { defineMessages } from 'react-intl';

export const messages: {
	heading: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	heading: {
		id: 'linkCreate.modal.heading',
		defaultMessage: 'Create new',
		description: 'Header for the create modal',
	},
});
