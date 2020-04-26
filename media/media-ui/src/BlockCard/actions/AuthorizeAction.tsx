import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ButtonAppearances } from '@atlaskit/button';

import { ActionProps } from '../components/Action';
import { messages } from '../../messages';

export const AuthorizeAction = (handler: () => void): ActionProps => ({
  id: 'connect-account',
  text: <FormattedMessage {...messages.connect_link_account_card} />,
  promise: () => new Promise(resolve => resolve(handler())),
  buttonAppearance: 'primary' as ButtonAppearances,
});
