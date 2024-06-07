import { defineMessages } from 'react-intl-next';

export const loadingErrorMessages = defineMessages({
	accessInstructionsDuplicate: {
		id: 'linkDataSource.accessInstructions',
		description:
			"Instructions to let the user know they must contact their site administrator in order to access this site's content",
		defaultMessage: 'To request access, contact your site administrator.',
	},
	//delete and remove duplicate from title above
	accessInstructions: {
		id: 'linkDataSource.jira-issues.accessInstructions',
		description:
			"Instructions to let the user know they must contact their site administrator in order to access this site's content",
		defaultMessage: 'To request access, contact your site administrator.',
	},
	accessRequiredDuplicate: {
		id: 'linkDataSource.accessRequired',
		description: 'Message letting user know that they do not have access to this content',
		defaultMessage: "You don't have access to this content",
	},
	//delete and remove duplicate from title above
	accessRequired: {
		id: 'linkDataSource.jira-issues.accessRequired',
		description: 'Message letting user know that they do not have access to this content',
		defaultMessage: "You don't have access to this content",
	},
	accessRequiredWithSiteDuplicate: {
		id: 'linkDataSource.accessRequiredWithSite',
		description:
			'Message letting user know that they do not have access to the site that will be listed below this message',
		defaultMessage: "You don't have access to the following site:",
	},
	//delete and remove duplicate from title above
	accessRequiredWithSite: {
		id: 'linkDataSource.jira-issues.accessRequiredWithSite',
		description:
			'Message letting user know that they do not have access to the site that will be listed below this message',
		defaultMessage: "You don't have access to the following site:",
	},
	checkConnectionDuplicate: {
		id: 'linkDataSource.checkConnection',
		description:
			'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
		defaultMessage: 'Check your connection and refresh, or try again later.',
	},
	//delete and remove duplicate from title above
	checkConnection: {
		id: 'linkDataSource.jira-issues.checkConnection',
		description:
			'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
		defaultMessage: 'Check your connection and refresh, or try again later.',
	},
	noResultsFoundDuplicate: {
		id: 'linkDataSource.noResultsFound',
		description: 'Status message letting the user know their query did not have any results',
		defaultMessage: 'No results found',
	},
	//delete and remove duplicate from title above
	noResultsFound: {
		id: 'linkDataSource.jira-issues.noResultsFound',
		description: 'Status message letting the user know their query did not have any results',
		defaultMessage: 'No results found',
	},
	refreshDuplicate: {
		id: 'linkDataSource.refresh',
		description: 'Button text to allow the user to refresh the table to see results',
		defaultMessage: 'Refresh',
	},
	//delete and remove duplicate from title above
	refresh: {
		id: 'linkDataSource.jira-issues.refresh',
		description: 'Button text to allow the user to refresh the table to see results',
		defaultMessage: 'Refresh',
	},
	unableToLoadItemsDuplicate: {
		id: 'linkDataSource.unableToLoadItems',
		description:
			'Error state message letting the user know we were unable the load the requested list of items',
		defaultMessage: 'Unable to load items',
	},
	//delete and remove duplicate from title above
	unableToLoadItems: {
		id: 'linkDataSource.jira-issues.unableToLoadItems',
		description:
			'Error state message letting the user know we were unable the load the requested list of items',
		defaultMessage: 'Unable to load items',
	},
	unableToLoadResultsDuplicate: {
		id: 'linkDataSource.unableToLoadResults',
		description:
			'Error state message letting the user know we were unable the load the requested list of results',
		defaultMessage: 'Unable to load results',
	},
	//delete and remove duplicate from title above
	unableToLoadResults: {
		id: 'linkDataSource.jira-issues.unableToLoadResults',
		description:
			'Error state message letting the user know we were unable the load the requested list of results',
		defaultMessage: 'Unable to load results',
	},
	// delete once EDM-9407 is merged
	noAccessToJiraSitesTitle: {
		id: 'linkDataSource.jira-issues.no.jira.sites.access.title',
		description: 'Title that shows in the modal when user has no access to any Jira sites',
		defaultMessage: "You don't have access to any Jira sites",
	},
	// delete once EDM-9407 is merged
	noAccessToJiraSitesDescription: {
		id: 'linkDataSource.jira-issues.no.jira.sites.access.description',
		description: 'Description that shows in the modal when user has no access to any Jira sites',
		defaultMessage: 'To request access, contact your admin.',
	},
	authScreenHeaderText: {
		id: 'linkDataSource.datasource.table.authScreenHeaderText',
		defaultMessage: 'Connect your {providerName} account',
		description: 'Header text to be displayed in the auth screen UI.',
	},
	authScreenDescriptionText: {
		id: 'linkDataSource.datasource.table.authScreenDescriptionText',
		defaultMessage:
			'Connect your {providerName} account to collaborate on work across Atlassian products.',
		description: 'Description text to be displayed in the auth screen UI.',
	},
	learnMoreAboutSmartLinks: {
		id: 'linkDataSource.datasource.table.learnMoreAboutSmartLinks',
		defaultMessage: 'Learn more about Smart Links.',
		description: 'An anchor link to redirect user to a page about Smart Links.',
	},
	authConnectButtonText: {
		id: 'linkDataSource.datasource.table.authConnectButtonText',
		defaultMessage: 'Connect',
		description: 'Label for the authentication button.',
	},
});
