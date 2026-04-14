import { defineMessages } from 'react-intl';

export const cancelButtonMessages: {
	cancelButtonText: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	cancelButtonText: {
		id: 'linkDataSource.configmodal.cancelButtonText',
		description: 'Button text to close the modal with no changes being made',
		defaultMessage: 'Cancel',
	},
});
