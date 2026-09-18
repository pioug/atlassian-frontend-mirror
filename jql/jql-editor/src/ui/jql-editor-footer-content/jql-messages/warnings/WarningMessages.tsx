import React from 'react';

import { di } from 'react-magnetic-di';

import { HelperMessage } from '@atlaskit/form/helper-message';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MessageContainer } from '../format/MessageContainer';
import { useFormattedWarningMessage } from './useFormattedWarningMessage';

export const WarningMessages = (): React.JSX.Element | null => {
	di(useFormattedWarningMessage);

	const warningMessage = useFormattedWarningMessage();

	return warningMessage != null ? (
		<MessageContainer>
			<HelperMessage testId="jql-editor-warning-message">
				<Box as="span" paddingInlineEnd="space.050">
					<StatusWarningIcon label="" color={token('color.icon.warning')} size="small" />
				</Box>
				{warningMessage}
			</HelperMessage>
		</MessageContainer>
	) : null;
};
