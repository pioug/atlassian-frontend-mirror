import React from 'react';
import { IconMessageWrapper } from './iconMessageWrapper';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl-next';
import { type InternalIconMessageProps, type CreatingPreviewProps } from './types';

export const IconMessage: React.FC<InternalIconMessageProps> = ({
	messageDescriptor,
	animated = false,
}) => {
	return (
		<IconMessageWrapper animated={animated}>
			<span>
				<FormattedMessage {...messageDescriptor} />
			</span>
		</IconMessageWrapper>
	);
};

export const CreatingPreview: React.FC<CreatingPreviewProps> = ({ disableAnimation }) => (
	<IconMessage messageDescriptor={messages.creating_preview} animated={!disableAnimation} />
);

export const PreviewUnavailable: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.preview_unavailable} />
);

export const FailedToLoad: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.failed_to_load} />
);

export const FailedToUpload: React.FC = (props) => (
	<IconMessage {...props} messageDescriptor={messages.failed_to_upload} />
);
