import React from 'react';

import { di } from 'react-magnetic-di';

import { HelperMessage } from '@atlaskit/form/helper-message';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MessageContainer } from '../format/MessageContainer';
import { useFormattedInfoMessage } from './useFormattedInfoMessage';

export const InfoMessages = (): React.JSX.Element | null => {
	di(useFormattedInfoMessage);

	const infoMessage = useFormattedInfoMessage();

	return infoMessage != null ? (
		<MessageContainer>
			<HelperMessage testId="jql-editor-info-message">
				<Box as="span" paddingInlineEnd="space.050">
					<StatusInformationIcon label="" color={token('color.icon.information')} size="small" />
				</Box>
				{infoMessage}
			</HelperMessage>
		</MessageContainer>
	) : null;
};
