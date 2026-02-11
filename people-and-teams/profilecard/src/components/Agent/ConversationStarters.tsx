import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import { AgentConversationStarters, type AgentConversationStartersProps, type ConversationStarter } from '@atlaskit/rovo-agent-components/ui/AgentConversationStarters';

export const ConversationStarters = ({
	isAgentDefault,
	onConversationStarterClick,
	userDefinedConversationStarters,
}: AgentConversationStartersProps): React.JSX.Element => {
	const handleConversationStarterClick = (conversationStarter: ConversationStarter) => {
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
