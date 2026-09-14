import React from 'react';

import { IntlProvider } from 'react-intl';

import { AgentAvatar } from '@atlaskit/rovo-agent-components/ui/AgentAvatar';

export default function AgentAvatarExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<AgentAvatar agentNamedId="rovo" label="Rovo agent" name="Rovo" size="medium" />
		</IntlProvider>
	);
}
