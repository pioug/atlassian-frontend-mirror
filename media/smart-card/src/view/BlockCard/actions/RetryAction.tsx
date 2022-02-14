import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { ActionProps } from '../components/Action';
import { messages } from '@atlaskit/media-ui/messages';

export const RetryAction = (handler: () => void): ActionProps => ({
  id: 'try-again',
  promise: async () => handler(),
  text: <FormattedMessage {...messages.try_again} />,
});
