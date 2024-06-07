import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { type ActionProps } from '../components/Action';
import { messages } from '../../../messages';
import { openUrl } from '../../../utils';

export const ViewAction = ({ url }: { url?: string }): ActionProps => ({
	id: 'view-content',
	text: <FormattedMessage {...messages.view} />,
	promise: () => openUrl(url),
});
