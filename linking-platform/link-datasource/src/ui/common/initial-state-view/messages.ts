import { defineMessages } from 'react-intl-next';

export const initialStateViewMessages = defineMessages({
	jiraSearchTitle: {
		id: 'linkDataSource.modal-initial-state.jiraSearchTitle',
		description:
			'The initial modal search state title that gives the user some idea about how to get information',
		defaultMessage: 'Search for Jira work items',
	},
	beta: {
		id: 'linkDataSource.modal-initial-state.beta',
		description: 'Beta lozenge',
		defaultMessage: 'Beta',
	},
	// everything below is a duplication from the work around EDM-9407
	// needs to be cleaned up after that PR is merged
	searchTitle: {
		id: 'linkDataSource.modal-initial-state.searchTitle',
		description:
			'The initial modal search state title that gives the user some idea about how to get information',
		defaultMessage: 'Search for Jira work items',
	},
	searchDescriptionForBasicSearch: {
		id: 'linkDataSource.modal-initial-state.searchDescription-basic',
		description:
			'The initial modal search state helper message displayed under the search title when basic search mode is selected',
		defaultMessage: 'Search by keyword for issues to insert.',
	},
	searchDescriptionForJQLSearch: {
		id: 'linkDataSource.modal-initial-state.searchDescription-jql',
		description:
			'The initial modal search state helper message displayed under the search title when JQL search mode is selected',
		defaultMessage: 'Use JQL (Jira Query Language) to search for issues.',
	},
	learnMoreLinkOld: {
		id: 'linkDataSource.modal-initial-state.learnMoreLinkOld',
		description:
			'The link that displays under the search description to help people know more about JQL',
		defaultMessage: 'Learn how to search with JQL',
	},
	learnMoreLink: {
		id: 'linkDataSource.modal-initial-state.learnMoreLink',
		description:
			'The link that displays under the search description to help people know more about JQL',
		defaultMessage: 'Find out more about searching with JQL',
	},
	searchDescriptionForJQLSearchIssueTermRefresh: {
		id: 'linkDataSource.modal-initial-state.searchDescription-jql-issue-term-refresh',
		description:
			'The initial modal search state helper message displayed under the search title when JQL search mode is selected',
		defaultMessage: 'Use JQL (Jira Query Language) to search for work items.',
	},
	searchDescriptionForBasicSearchIssueTermRefresh: {
		id: 'linkDataSource.modal-initial-state.searchDescription-basic-issue-term-refresh',
		description:
			'The initial modal search state helper message displayed under the search title when basic search mode is selected',
		defaultMessage: 'Search by keyword for work items to insert.',
	},
	searchDescriptionForBasicSearchVisualRefreshSllv: {
		id: 'linkDataSource.modal-initial-state.searchDescription-basic.visualRefreshSllv',
		description:
			'The initial modal search state helper message displayed under the search title when basic search mode is selected',
		defaultMessage: 'Start typing or use JQL to search.',
	},
});
