import { defineMessages } from 'react-intl';

export const messages: {
	siteLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	siteLabel: {
		id: 'linkCreate.CreateConfluencePage.form.site.label',
		defaultMessage: 'Site',
		description: 'Label for the Site dropdown list',
	},
});
