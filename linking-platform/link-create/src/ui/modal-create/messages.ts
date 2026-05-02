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
		description:
			'Heading displayed at the top of the modal dialog used to create a new item (e.g. a page or issue)',
	},
});
