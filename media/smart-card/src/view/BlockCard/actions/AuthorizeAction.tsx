import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { Appearance } from '@atlaskit/button/types';

import { ActionProps } from '../components/Action';
import { messages } from '@atlaskit/media-ui/messages';

export const AuthorizeAction = (handler: () => void): ActionProps => ({
  id: 'connect-account',
  text: <FormattedMessage {...messages.connect_link_account_card} />,
  promise: () => new Promise((resolve) => resolve(handler())),
  buttonAppearance: 'default' as Appearance,
});
