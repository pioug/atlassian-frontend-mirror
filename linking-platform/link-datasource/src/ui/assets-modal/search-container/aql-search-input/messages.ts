import { defineMessages } from 'react-intl';

export const searchInputMessages: {
	placeholder: {
		id: string;
		description: string;
		defaultMessage: string;
	};
	helpTooltipText: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	placeholder: {
		id: 'linkDataSource.assets.configModal.aqlSearchInput.placeholder',
		description: 'Display text for AQL search button',
		defaultMessage: 'Search via AQL',
	},
	helpTooltipText: {
		id: 'linkDataSource.assets.configModal.aqlSearchInput.helpTooltipText',
		description: 'Link to AQL Syntax help document',
		defaultMessage: 'Syntax help',
	},
});
