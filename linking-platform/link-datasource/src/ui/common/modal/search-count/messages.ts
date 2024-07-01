import { defineMessages } from 'react-intl-next';

export const searchCountMessages = defineMessages({
	resultCountText: {
		id: 'linkDataSource.search.configmodal.resultCountText',
		description: 'Text that indicates the number of search results.',
		defaultMessage: '{searchCount, plural, one {# result} other {# results}}',
	},
	issueCountText: {
		id: 'linkDataSource.search.configmodal.issueCountText',
		description: 'Text that indicates the number of jira issues in the search result.',
		defaultMessage: '{searchCount, plural, one {# issue} other {# issues}}',
	},
	itemCountText: {
		id: 'linkDataSource.search.configmodal.itemCountText',
		description: 'Text that indicates the number of items in the search result.',
		defaultMessage: '{searchCount, plural, one {# item} other {# items}}',
	},
});
