import React from 'react';

import { messages } from '@atlaskit/media-ui/messages';

import { IconMessage } from './IconMessage';

export const PreviewUnavailable: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.preview_unavailable} />
);
