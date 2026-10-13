import React, { useState } from 'react';

import { Text } from '@atlaskit/primitives/compiled/text';
import { AgentProfileCardTrigger } from '@atlaskit/profilecard/agent-profile-card-trigger';
import type { ProfileClient } from '@atlaskit/profilecard/types';

type AgentProfileCardTriggerExampleProps = {
	/** Use an agent ID that the current viewer is authorized to access. */
	agentId: string;
	cloudId: string;
	resourceClient: ProfileClient;
};

export default function AgentProfileCardTriggerExample({
	agentId,
	cloudId,
	resourceClient,
}: AgentProfileCardTriggerExampleProps): React.JSX.Element {
	const [status, setStatus] = useState('Open the agent profile to see its available actions.');
	return (
		<>
			<AgentProfileCardTrigger
				agentId={agentId}
				cloudId={cloudId}
				resourceClient={resourceClient}
				trigger="click"
				hideStarButton
				onChatClick={() =>
					setStatus('Example chat callback received locally; connect it to the host chat route.')
				}
				onConversationStartersClick={(starter) =>
					setStatus('Example starter selected locally: ' + starter.message)
				}
			>
				<button type="button">View agent profile</button>
			</AgentProfileCardTrigger>
			<Text role="status">{status}</Text>
		</>
	);
}
