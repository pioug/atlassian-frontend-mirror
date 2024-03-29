import { defineMessages } from 'react-intl-next';

export const modalMessages = defineMessages({
  cancelButtonText: {
    id: 'linkDataSource.jira-issues.configmodal.cancelButtonText',
    description: 'Button text to close the modal with no changes being made',
    defaultMessage: 'Cancel',
  },
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
  tableViewModeLabel: {
    id: 'linkDataSource.jira-issues.configmodal.tableViewModeLabel',
    description: 'Display Jira search results as a table',
    defaultMessage: 'Table',
  },
  tableViewModeDescription: {
    id: 'linkDataSource.jira-issues.configmodal.tableViewModeDescription',
    description: 'Description for table view mode',
    defaultMessage: 'Display Jira search results as a table',
  },
  inlineLinkViewModeLabel: {
    id: 'linkDataSource.jira-issues.configmodal.inlineLinkViewModeLabel',
    description: 'Display the number of search results as an inline smart link',
    defaultMessage: 'Inline link',
  },
  inlineLinkViewModeDescription: {
    id: 'linkDataSource.jira-issues.configmodal.inlineLinkViewModeDescription',
    description: 'Description for inline link view mode',
    defaultMessage:
      'Display the number of search results or as an inline smart link',
  },
  issuesCountSmartCardPlaceholderText: {
    id: 'linkDataSource.jira-issues.configmodal.placeholder.issues',
    description:
      'Placeholder text that will be placed next to a count of jira issues',
    defaultMessage: '### Issues',
  },
  issueText: {
    id: 'linkDataSource.jira-issues.configmodal.issue',
    description: 'Text that appears after issue count number.',
    defaultMessage: '{totalCount, plural, one {issue} other {issues}}',
  },
  searchJiraTitleDuplicate: {
    id: 'linkDataSource.jira-issues.searchJiraTitle',
    description:
      'The initial modal search state title that gives the user some idea about how to get information',
    defaultMessage: 'Search for Jira issues',
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
    defaultMessage: 'Search by keyword for issues to insert.',
  },
  // delete and remove duplicate from title above once EDM-9407 is merged
  searchDescriptionForJiraBasicSearch: {
    id: 'linkDataSource.modal-initial-state.searchDescription-basic',
    description:
      'The initial modal search state helper message displayed under the search title when basic search mode is selected',
    defaultMessage: 'Search by keyword for issues to insert.',
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
    description:
      'Title that shows in the modal when user has no access to any Jira sites',
    defaultMessage: "You don't have access to any Jira sites",
  },
  // delete and remove duplicate from title above once EDM-9407 is merged
  noAccessToJiraSitesTitle: {
    id: 'linkDataSource.jira-issues.no.jira.sites.access.title',
    description:
      'Title that shows in the modal when user has no access to any Jira sites',
    defaultMessage: "You don't have access to any Jira sites",
  },
  noAccessToJiraSitesDescriptionDuplicate: {
    id: 'linkDataSource.no.jira.sites.access.description',
    description:
      'Description that shows in the modal when user has no access to any Jira sites',
    defaultMessage: 'To request access, contact your admin.',
  },
  // delete and remove duplicate from title above once EDM-9407 is merged
  noAccessToJiraSitesDescription: {
    id: 'linkDataSource.jira-issues.no.jira.sites.access.description',
    description:
      'Description that shows in the modal when user has no access to any Jira sites',
    defaultMessage: 'To request access, contact your admin.',
  },
});
