import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import { type Appearance } from '@atlaskit/button/types';

import { messages } from '../../../messages';
import { type ActionProps } from '../../types';

export const ForbiddenAction = (
	handler: () => void,
	id = 'connect-other-account',
	message: MessageDescriptor = messages.try_another_account,
	values = {},
): ActionProps => ({
	id,
	text: <FormattedMessage {...message} values={values} />,
	promise: () => new Promise((resolve) => resolve(handler())),
	buttonAppearance: 'default' as Appearance,
});
