import { defineMessages } from 'react-intl';

export const userTypeMessages: {
	userDefaultdisplayNameValue: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	userDefaultdisplayNameValue: {
		id: 'linkDataSource.render-type.user.default.display.name',
		description: 'Text to display for the user type when no display value is provided',
		defaultMessage: 'Unassigned',
	},
});
