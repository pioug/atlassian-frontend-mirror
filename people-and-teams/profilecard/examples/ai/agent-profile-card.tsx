import React from 'react';

import AgentProfileCard from '@atlaskit/profilecard/agent-profile-card';

import { docsAgent, docsProfileClient } from '../mocks/docs-profile-client';

export default function AgentProfileCardExample(): React.JSX.Element {
	return (
		<AgentProfileCard
			agent={docsAgent}
			resourceClient={docsProfileClient}
			cloudId="example-cloud"
			hideAgentActions
			hideConversationStarters
			hideStarButton
			hideMoreActions
		/>
	);
}
