import { defineMessages } from 'react-intl-next';

export const searchMessages: {
	searchLabel: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	searchLabel: {
		id: 'linkDataSource.confluence-search.configmodal.searchLabel',
		description: 'Placeholder text for the search input box',
		defaultMessage: 'Enter keywords to find pages, attachments, and more',
	},
});
