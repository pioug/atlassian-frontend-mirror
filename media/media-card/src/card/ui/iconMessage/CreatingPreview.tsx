import React from 'react';

import { messages } from '@atlaskit/media-ui/messages';

import { IconMessage } from './IconMessage';
import { type CreatingPreviewProps } from './types';

export const CreatingPreview: React.FC<CreatingPreviewProps> = ({ disableAnimation }) => (
	<IconMessage messageDescriptor={messages.creating_preview} animated={!disableAnimation} />
);
