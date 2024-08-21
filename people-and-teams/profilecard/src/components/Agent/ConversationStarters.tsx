import React from 'react';

import { Stack } from '@atlaskit/primitives';
import {
	AgentConversationStarters,
	type AgentConversationStartersProps,
} from '@atlaskit/rovo-agent-components';

export const ConversationStarters = ({
	isAgentDefault,
	onConversationStarterClick,
	userDefinedConversationStarters,
}: AgentConversationStartersProps) => {
	const handleConversationStarterClick = (conversationStarter: string) => {
		onConversationStarterClick(conversationStarter);
	};
	return (
		<Stack space="space.050" alignInline="start">
			<AgentConversationStarters
				isAgentDefault={isAgentDefault}
				onConversationStarterClick={handleConversationStarterClick}
				userDefinedConversationStarters={userDefinedConversationStarters}
			/>
		</Stack>
	);
};
