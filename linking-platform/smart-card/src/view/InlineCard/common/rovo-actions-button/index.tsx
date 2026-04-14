import React from 'react';

import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import { token } from '@atlaskit/tokens';

export interface RovoActionsButtonProps {
	testId?: string;
}

export const RovoActionsButton = ({ testId }: RovoActionsButtonProps) => {
	return (
		<span data-testid={testId}>
			<RovoChatIcon label="Rovo" color={token('color.icon.inverse')} size="small" />
		</span>
	);
};
