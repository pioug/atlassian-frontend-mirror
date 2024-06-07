import { defineMessages } from 'react-intl-next';

export const initialStateViewMessages = defineMessages({
	searchTitle: {
		id: 'linkDataSource.assets.configModal.renderAssetsContent.initialStateView.searchTitle',
		description:
			'The initial search state title that gives the user some idea about how to get information',
		defaultMessage: 'Search for objects',
	},
	searchDescription: {
		id: 'linkDataSource.assets.configModal.renderAssetsContent.initialStateView.searchDescription',
		description: 'The initial search state helper message displays under the search title',
		defaultMessage: 'Start typing or use AQL to search.',
	},
	learnMoreLink: {
		id: 'linkDataSource.assets.configModal.renderAssetsContent.initialStateView.learnMoreLink',
		description:
			'The link that displays under the search description to help people know more about AQL',
		defaultMessage: 'Learn more about searching with AQL.',
	},
});
