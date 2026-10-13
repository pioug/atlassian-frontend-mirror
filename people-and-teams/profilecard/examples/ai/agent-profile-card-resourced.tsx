import React from 'react';

import { AgentProfileCardResourced } from '@atlaskit/profilecard/agent-profile-card-resourced';

import { docsProfileClient } from '../mocks/docs-profile-client';

export default function AgentProfileCardResourcedExample(): React.JSX.Element {
	return (
		<AgentProfileCardResourced
			accountId="example-agent"
			cloudId="example-cloud"
			resourceClient={docsProfileClient}
			hideAgentActions
			hideConversationStarters
			hideStarButton
			hideMoreActions
		/>
	);
}
