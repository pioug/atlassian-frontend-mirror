import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Appearance } from '@atlaskit/button/types';

import { ActionProps } from '../components/Action';
import { messages } from '../../messages';

export const ForbiddenAction = (
  handler: () => void,
  id = 'connect-other-account',
  message = messages.try_another_account,
  context = '',
): ActionProps => ({
  id,
  text: <FormattedMessage {...message} values={{ context }} />,
  promise: () => new Promise((resolve) => resolve(handler())),
  buttonAppearance: 'default' as Appearance,
});
