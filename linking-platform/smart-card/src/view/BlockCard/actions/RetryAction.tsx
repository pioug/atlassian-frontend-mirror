import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { messages } from '../../../messages';
import { type ActionProps } from '../components/Action';

export const RetryAction = (handler: () => void): ActionProps => ({
	id: 'try-again',
	promise: async () => handler(),
	text: <FormattedMessage {...messages.try_again} />,
});
