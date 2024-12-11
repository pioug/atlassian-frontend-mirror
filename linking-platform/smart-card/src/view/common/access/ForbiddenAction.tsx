import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { type Appearance } from '@atlaskit/button/types';

import { messages } from '../../../messages';
import { type ActionProps } from '../../types';

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
