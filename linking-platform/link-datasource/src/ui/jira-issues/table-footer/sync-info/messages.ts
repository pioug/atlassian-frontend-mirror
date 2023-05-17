import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  underOneMinuteText: {
    id: 'linkDataSource.jira-issues.table-footer.date_formatter.under_one_minute',
    defaultMessage: 'Synced just now',
    description:
      'A text to indicate the last data fetch time was under a minute.',
  },
  overOneMinuteText: {
    id: 'linkDataSource.jira-issues.table-footer.date_formatter.under_over_minute',
    defaultMessage: 'Synced {date}',
    description:
      'A text to indicate the last data fetch time was over a minute.',
  },
});
