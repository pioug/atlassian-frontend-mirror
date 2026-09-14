import React from 'react';

import { messages } from '@atlaskit/media-ui/messages';

import { IconMessage } from './IconMessage';

export const FailedToUpload: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.failed_to_upload} />
);
