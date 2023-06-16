import { defineMessages } from 'react-intl-next';

export const footerMessages = defineMessages({
  singularIssue: {
    id: 'linkDataSource.table-footer.issue',
    description: 'Text that appears after single issue count number.',
    defaultMessage: 'issue',
  },
  pluralIssues: {
    id: 'linkDataSource.table-footer.issues',
    description: 'Text that appears after plural issue count number.',
    defaultMessage: 'issues',
  },
  loadingText: {
    id: 'linkDataSource.table-footer.loading',
    description: 'Text that appears when table is loading.',
    defaultMessage: 'Loading...',
  },
  refreshLabel: {
    id: 'linkDataSource.table-footer.refresh',
    description: 'Label for refresh icon',
    defaultMessage: 'Refresh',
  },
});
