import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { type ActionProps } from '../components/Action';
import { messages } from '../../../messages';

export const RetryAction = (handler: () => void): ActionProps => ({
	id: 'try-again',
	promise: async () => handler(),
	text: <FormattedMessage {...messages.try_again} />,
});
