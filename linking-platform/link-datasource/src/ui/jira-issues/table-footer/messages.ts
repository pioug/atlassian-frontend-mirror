import { defineMessages } from 'react-intl-next';

export const footerMessages = defineMessages({
  issueText: {
    id: 'linkDataSource.jira-issues.table-footer.issue',
    description:
      'Text that appears after issue count number if there is only 1 issue.',
    defaultMessage:
      '{issueCount} {issueCount, plural, one {issue} other {issues}}',
  },
  loadingText: {
    id: 'linkDataSource.jira-issues.table-footer.loading',
    description: 'Text that appears when table is loading.',
    defaultMessage: 'Loading...',
  },
  refreshLabel: {
    id: 'linkDataSource.jira-issues.table-footer.refresh',
    description: 'Label for refresh icon',
    defaultMessage: 'Refresh',
  },
});
