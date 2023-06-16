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
      'Title for the Jira Issues Datasource config modal when multiple sites are available',
    defaultMessage: 'Insert Jira issues from {siteName}',
  },
  issueViewModeLabel: {
    id: 'linkDataSource.jira-issues.configmodal.issueViewModeLabel',
    description:
      'Label for toggle to enable a view mode showing issues in a table list view',
    defaultMessage: 'Issue view',
  },
  countViewModeLabel: {
    id: 'linkDataSource.jira-issues.configmodal.countViewModeLabel',
    description:
      'Label for toggle to enable a view mode showing issues in as a total count',
    defaultMessage: 'Count view',
  },
  issuesCountSmartCardPlaceholderText: {
    id: 'linkDataSource.jira-issues.configmodal.placeholder.issues',
    description:
      'Placeholder text that will be placed next to a count of jira issues',
    defaultMessage: '### Issues',
  },
  singularIssue: {
    id: 'linkDataSource.jira-issues.configmodal.singular.issue',
    description: 'Text that appears after single issue count number.',
    defaultMessage: 'issue',
  },
  pluralIssues: {
    id: 'linkDataSource.jira-issues.configmodal.plural.issues',
    description: 'Text that appears after plural issue count number.',
    defaultMessage: 'issues',
  },
});
