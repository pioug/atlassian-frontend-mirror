import { defineMessages } from 'react-intl-next';

export const modalMessages = defineMessages({
	insertIssuesButtonText: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesButtonText',
		description: 'Button text to insert the displayed content',
		defaultMessage: 'Insert issues',
	},
	insertIssuesTitle: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesTitle',
		description: 'Title for the Jira Issues Datasource config modal',
		defaultMessage: 'Insert Jira issues',
	},
	insertIssuesTitleManySites: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesTitleManySites',
		description:
			'Title for the Jira Issues modal when a user has to select a site to inserting issues from',
		defaultMessage: 'Insert Jira issues from',
	},
	issuesCountSmartCardPlaceholderText: {
		id: 'linkDataSource.jira-issues.configmodal.placeholder.issues',
		description: 'Placeholder text that will be placed next to a count of jira issues',
		defaultMessage: '### Issues',
	},
	searchJiraTitleDuplicate: {
		id: 'linkDataSource.jira-issues.searchJiraTitle',
		description:
			'The initial modal search state title that gives the user some idea about how to get information',
		defaultMessage: 'Search for Jira work items',
	},
	// delete and remove duplicate from title above once EDM-9407 is merged
	searchJiraTitle: {
		id: 'linkDataSource.modal-initial-state.searchTitle',
		description:
			'The initial modal search state title that gives the user some idea about how to get information',
		defaultMessage: 'Search for Jira issues',
	},
	searchDescriptionForJiraBasicSearchDuplicate: {
		id: 'linkDataSource.jira-issues.searchDescription-basic',
		description:
			'The initial modal search state helper message displayed under the search title when basic search mode is selected',
		defaultMessage: 'Search by keyword for work items to insert.',
	},
	// delete and remove duplicate from title above once EDM-9407 is merged
	searchDescriptionForJiraBasicSearch: {
		id: 'linkDataSource.modal-initial-state.searchDescription-basic',
		description:
			'The initial modal search state helper message displayed under the search title when basic search mode is selected',
		defaultMessage: 'Search by keyword for work items to insert.',
	},
	searchDescriptionForJiraJQLSearchDuplicate: {
		id: 'linkDataSource.jira-issues.searchDescription-jql',
		description:
			'The initial modal search state helper message displayed under the search title when JQL search mode is selected',
		defaultMessage: 'Use JQL (Jira Query Language) to search for issues.',
	},
	// delete and remove duplicate from title above once EDM-9407 is merged
	searchDescriptionForJiraJQLSearch: {
		id: 'linkDataSource.modal-initial-state.searchDescription-jql',
		description:
			'The initial modal search state helper message displayed under the search title when JQL search mode is selected',
		defaultMessage: 'Use JQL (Jira Query Language) to search for issues.',
	},
	learnMoreLinkDuplicate: {
		id: 'linkDataSource.jira-issues.learnMoreLink',
		description:
			'The link that displays under the search description to help people know more about JQL',
		defaultMessage: 'Learn how to search with JQL',
	},
	// delete and remove duplicate from title above once EDM-9407 is merged
	learnMoreLink: {
		id: 'linkDataSource.modal-initial-state.learnMoreLink',
		description:
			'The link that displays under the search description to help people know more about JQL',
		defaultMessage: 'Learn how to search with JQL',
	},
	noAccessToJiraSitesTitleDuplicate: {
		id: 'linkDataSource.no.jira.sites.access.title',
		description: 'Title that shows in the modal when user has no access to any Jira sites',
		defaultMessage: "You don't have access to any Jira sites",
	},
	// delete and remove duplicate from title above once EDM-9407 is merged
	noAccessToJiraSitesTitle: {
		id: 'linkDataSource.jira-issues.no.jira.sites.access.title',
		description: 'Title that shows in the modal when user has no access to any Jira sites',
		defaultMessage: "You don't have access to any Jira sites",
	},
	noAccessToJiraSitesDescriptionDuplicate: {
		id: 'linkDataSource.no.jira.sites.access.description',
		description: 'Description that shows in the modal when user has no access to any Jira sites',
		defaultMessage: 'To request access, contact your admin.',
	},
	// delete and remove duplicate from title above once EDM-9407 is merged
	noAccessToJiraSitesDescription: {
		id: 'linkDataSource.jira-issues.no.jira.sites.access.description',
		description: 'Description that shows in the modal when user has no access to any Jira sites',
		defaultMessage: 'To request access, contact your admin.',
	},
	checkConnectionWithSource: {
		id: 'linkDataSource.jira-issues.checkConnectionWithSource',
		description:
			'Instructions to let the user know how to resolve the error that occured, or click the link provided to open the query in Jira',
		defaultMessage:
			'Check your connection and refresh, or <a>open this query in Jira</a> to review.',
	},
	checkConnectionWithSourceVisualRefreshSllv: {
		id: 'linkDataSource.jira-issues.checkConnectionWithSource.visual-refresh-sllv',
		description:
			'Instructions to let the user know how to resolve the error that occured, or click the link provided to open the query in Jira',
		defaultMessage:
			'Check your connection and refresh, or <a>open this project in Jira</a> to review.',
	},
	insertIssuesButtonTextIssueTermRefresh: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesButtonText-issue-term-refresh',
		description: 'Button text to insert the displayed content',
		defaultMessage: 'Insert work items',
	},
	insertIssuesButtonTextIssueTermSllv: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesButtonText-issue-term-sllv',
		description: 'Button text to insert the displayed content',
		defaultMessage: 'Insert results',
	},
	insertIssuesTitleIssueTermRefresh: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesTitle-issue-term-refresh',
		description: 'Title for the Jira Issues Datasource config modal',
		defaultMessage: 'Insert Jira work items',
	},
	insertIssuesTitleManySitesIssueTermRefresh: {
		id: 'linkDataSource.jira-issues.configmodal.insertIssuesTitleManySites-issue-term-refresh',
		description:
			'Title for the Jira Issues modal when a user has to select a site to inserting issues from',
		defaultMessage: 'Insert Jira work items from',
	},
	issuesCountSmartCardPlaceholderTextIssueTermRefresh: {
		id: 'linkDataSource.jira-issues.configmodal.placeholder.issues-issue-term-refresh',
		description: 'Placeholder text that will be placed next to a count of jira issues',
		defaultMessage: '### work items',
	},
	searchJiraTitleIssueTermRefresh: {
		id: 'linkDataSource.modal-initial-state.searchTitle-issue-term-refresh',
		description:
			'The initial modal search state title that gives the user some idea about how to get information',
		defaultMessage: 'Search for Jira work items',
	},
});
