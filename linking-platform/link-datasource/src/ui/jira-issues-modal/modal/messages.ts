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
});
