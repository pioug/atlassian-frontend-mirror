import { defineMessages } from 'react-intl';

export const messages: {
	createAndOpen: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	createAndOpen: {
		id: 'linkCreate.createForm.button.createAndOpen',
		defaultMessage: 'Create + Open',
		description: 'Button to create the object and subsequently open a screen to edit',
	},
});
