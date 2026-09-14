import React from 'react';

import { messages } from '@atlaskit/media-ui/messages';

import { IconMessage } from './IconMessage';

export const FailedToLoad: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.failed_to_load} />
);
