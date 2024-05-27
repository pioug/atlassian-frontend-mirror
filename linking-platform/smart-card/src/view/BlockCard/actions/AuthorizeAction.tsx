import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { type Appearance } from '@atlaskit/button/types';

import { type ActionProps } from '../components/Action';
import { messages } from '../../../messages';

export const AuthorizeAction = (handler: () => void): ActionProps => ({
  id: 'connect-account',
  text: <FormattedMessage {...messages.connect_link_account_card} />,
  promise: () => new Promise((resolve) => resolve(handler())),
  buttonAppearance: 'default' as Appearance,
});
