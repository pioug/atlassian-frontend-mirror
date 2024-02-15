import type { IntlShape } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/quick-insert';

export function getCategories(intl: IntlShape) {
  return [
    {
      title: intl.formatMessage(messages.all),
      name: 'all',
    },
    { title: intl.formatMessage(messages.formatting), name: 'formatting' },
    {
      title: intl.formatMessage(messages['confluence-content']),
      name: 'confluence-content',
    },
    { title: intl.formatMessage(messages.media), name: 'media' },
    { title: intl.formatMessage(messages.visuals), name: 'visuals' },
    { title: intl.formatMessage(messages.navigation), name: 'navigation' },
    {
      title: intl.formatMessage(messages['external-content']),
      name: 'external-content',
    },
    {
      title: intl.formatMessage(messages.communication),
      name: 'communication',
    },
    { title: intl.formatMessage(messages.reporting), name: 'reporting' },
    { title: intl.formatMessage(messages.admin), name: 'admin' },
    {
      title: intl.formatMessage(messages.development),
      name: 'development',
    },
  ];
}
