import { defineMessages } from 'react-intl-next';

export const footerMessages = defineMessages({
  issueText: {
    id: 'linkDataSource.table-footer.issue',
    description: 'Text that appears after issue count number.',
    defaultMessage: '{issueCount, plural, one {issue} other {issues}}',
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
