import { defineMessages } from 'react-intl-next';

export const basicSearchInputMessages = defineMessages({
	basicTextSearchLabelDuplicate: {
		id: 'linkDataSource.configmodal.basicTextSearchPlaceholder',
		description: 'Placeholder text for the search input box',
		defaultMessage: 'Search for issues by keyword',
	},
	basicTextSearchLabel: {
		id: 'linkDataSource.jira-issues.configmodal.basicTextSearchPlaceholder',
		description: 'Placeholder text for the search input box',
		defaultMessage: 'Search for issues by keyword',
	},
	basicTextSearchLabelDuplicateIssueTermRefresh: {
		id: 'linkDataSource.configmodal.basicTextSearchPlaceholder-issue-term-refresh',
		description: 'Placeholder text for the search input box',
		defaultMessage: 'Search for work items by keyword',
	},
	basicTextSearchLabelIssueTermRefresh: {
		id: 'linkDataSource.jira-issues.configmodal.basicTextSearchPlaceholder-issue-term-refresh',
		description: 'Placeholder text for the search input box',
		defaultMessage: 'Search for work items by keyword',
	},
});
