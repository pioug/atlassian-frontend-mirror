import React from 'react';

import { messages } from '@atlaskit/media-ui/messages';

import { IconMessage } from './IconMessage';

export const CheckInternetConnection: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.check_internet_connection} />
);
