import { defineMessages } from 'react-intl';

export const loadingErrorMessages: {
	//delete and remove duplicate from title above
	accessInstructions: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	accessInstructionsDuplicate: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	//delete and remove duplicate from title above
	accessRequired: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	accessRequiredDuplicate: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	accessRequiredWithSite: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	authConnectButtonText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	authScreenDescriptionText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	authScreenDescriptionTextAppify: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	authScreenHeaderText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	//delete and remove duplicate from title above
	checkConnection: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	checkConnectionConfluence: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	checkConnectionDuplicate: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	checkConnectionJira: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	learnMoreAboutSmartLinks: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	// delete once EDM-9407 is merged
	noAccessToJiraSitesDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	// delete once EDM-9407 is merged
	noAccessToJiraSitesTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noResultsFound: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noResultsFoundDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	//delete and remove duplicate from title above
	refresh: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	refreshDuplicate: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unableToLoadItemsDuplicate: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unableToLoadResults: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
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
	accessRequiredWithSite: {
		id: 'linkDataSource.jira-issues.accessRequiredWithSite',
		description:
			'Message letting user know that they do not have access to the site that will be listed below this message',
		defaultMessage: "You don't have access to",
	},
	checkConnectionDuplicate: {
		id: 'linkDataSource.checkConnection',
		description:
			'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
		defaultMessage: 'Check your connection and refresh, or try again later.',
	},
	checkConnectionConfluence: {
		id: 'linkDataSource.jira-issues.checkConnection.confluence',
		description:
			'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
		defaultMessage:
			'Check your connection and refresh, or <a>open this search in Confluence</a> to review.',
	},
	checkConnectionJira: {
		id: 'linkDataSource.jira-issues.checkConnection.jira',
		description:
			'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
		defaultMessage:
			'Check your connection and refresh, or <a>open this search in Jira</a> to review. ',
	},
	//delete and remove duplicate from title above
	checkConnection: {
		id: 'linkDataSource.jira-issues.checkConnection',
		description:
			'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
		defaultMessage: 'Check your connection and refresh, or try again later.',
	},
	noResultsFound: {
		id: 'linkDataSource.jira-issues.noResultsFound',
		description: 'Status message letting the user know their query did not have any results',
		defaultMessage: "We couldn't find anything matching your search",
	},
	noResultsFoundDescription: {
		id: 'linkDataSource.jira-issues.noResultsFound.description',
		description: 'Status message letting the user know their query did not have any results',
		defaultMessage: 'Try again with a different term.',
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
	unableToLoadResults: {
		id: 'linkDataSource.jira-issues.unableToLoadResults',
		description:
			'Error state message letting the user know we were unable the load the requested list of results',
		defaultMessage: 'We ran into an issue trying to fetch results',
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
	authScreenDescriptionTextAppify: {
		id: 'linkDataSource.datasource.table.authScreenDescriptionText-appify',
		defaultMessage:
			'Connect your {providerName} account to collaborate on work across Atlassian apps.',
		description: 'Description text to be displayed in the auth screen UI.',
	},
});

export const missingColumnsMessages: Record<
	'missingColumnsDescription' | 'missingColumnsDescriptionWithNames' | 'missingColumnsTitle',
	{ defaultMessage: string; description: string; id: string }
> = defineMessages({
	missingColumnsTitle: {
		id: 'link-datasource.common.error-state.missingColumnsTitle',
		description: 'Error title when results have loaded but no selected columns are available',
		defaultMessage: "We can't display these columns",
	},
	missingColumnsDescription: {
		id: 'link-datasource.common.error-state.missingColumnsDescription',
		description: 'Instructions for recovering a table with no available selected columns',
		defaultMessage:
			"The selected columns aren't available. Edit this table to select different columns.",
	},
	missingColumnsDescriptionWithNames: {
		id: 'link-datasource.common.error-state.missingColumnsDescriptionWithNames',
		description:
			'Instructions for recovering a table, with columns listing the unavailable saved column names or keys',
		defaultMessage:
			"These columns aren't available: {columns}. Edit this table to select different columns.",
	},
});
