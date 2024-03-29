import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { Appearance } from '@atlaskit/button/types';

import { ActionProps } from '../components/Action';
import { messages } from '../../../messages';

export const ForbiddenAction = (
  handler: () => void,
  id = 'connect-other-account',
  message = messages.try_another_account,
  values = {},
): ActionProps => ({
  id,
  text: <FormattedMessage {...message} values={values} />,
  promise: () => new Promise((resolve) => resolve(handler())),
  buttonAppearance: 'default' as Appearance,
});
