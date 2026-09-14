import React from 'react';

import { FormattedMessage } from 'react-intl';

import { IconMessageWrapper } from './iconMessageWrapper';
import { type InternalIconMessageProps } from './types';

export const IconMessage: React.FC<InternalIconMessageProps> = ({
	messageDescriptor,
	animated = false,
}) => {
	return (
		<IconMessageWrapper animated={animated}>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<span>
				<FormattedMessage {...messageDescriptor} />
			</span>
		</IconMessageWrapper>
	);
};
