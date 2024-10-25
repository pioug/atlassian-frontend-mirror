import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { messages } from '../../../messages';
import { openUrl } from '../../../utils';
import { type ActionProps } from '../components/Action';

export const ViewAction = ({ url }: { url?: string }): ActionProps => ({
	id: 'view-content',
	text: <FormattedMessage {...messages.view} />,
	promise: () => openUrl(url),
});
