import { defineMessages } from 'react-intl-next';

export const loadingErrorMessages = defineMessages({
  accessInstructions: {
    id: 'linkDataSource.jira-issues.accessInstructions',
    description:
      "Instructions to let the user know they must contact their site administrator in order to access this site's content",
    defaultMessage: 'To request access, contact your site administrator.',
  },
  accessRequired: {
    id: 'linkDataSource.jira-issues.accessRequired',
    description:
      'Message letting user know that they do not have access to this site',
    defaultMessage: "You don't have access to this site",
  },
  accessRequiredWithSite: {
    id: 'linkDataSource.jira-issues.accessRequiredWithSite',
    description:
      'Message letting user know that they do not have access to the site that will be listed below this message',
    defaultMessage: "You don't have access to the following site:",
  },
  checkConnection: {
    id: 'linkDataSource.jira-issues.checkConnection',
    description:
      'Instructions to let the user know how to resolve the network error that occurred or to try again at a different time',
    defaultMessage: 'Check your connection and refresh, or try again later.',
  },
  checkConnectionWithSource: {
    id: 'linkDataSource.jira-issues.checkConnectionWithSource',
    description:
      'Instructions to let the user know how to resolve the error that occured, or click the link provided to open the query in Jira',
    defaultMessage:
      'Check your connection and refresh, or <a>open this query in Jira</a> to review.',
  },
  noResultsFound: {
    id: 'linkDataSource.jira-issues.noResultsFound',
    description:
      'Status message letting the user know their query did not have any results',
    defaultMessage: 'No results found',
  },
  refresh: {
    id: 'linkDataSource.jira-issues.refresh',
    description:
      'Button text to allow the user to refresh the table to see results',
    defaultMessage: 'Refresh',
  },
  unableToLoadItems: {
    id: 'linkDataSource.jira-issues.unableToLoadItems',
    description:
      'Error state message letting the user know we were unable the load the requested list of items',
    defaultMessage: 'Unable to load items',
  },
  unableToLoadResults: {
    id: 'linkDataSource.jira-issues.unableToLoadResults',
    description:
      'Error state message letting the user know we were unable the load the requested list of results',
    defaultMessage: 'Unable to load results',
  },
});
