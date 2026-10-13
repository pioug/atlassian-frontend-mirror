import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { AgentProfileCardResourced } from '@atlaskit/profilecard/agent-profile-card-resourced';

import { docsProfileClient } from '../mocks/docs-profile-client';

function OpenAgentCard(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div data-testid="component-preview">
			<Stack space="space.100">
				<Button onClick={() => setIsOpen((current) => !current)}>
					{isOpen ? 'Close profile card' : 'View Example assistant'}
				</Button>
				{isOpen && (
					<AgentProfileCardResourced
						accountId="example-agent"
						cloudId="example-cloud"
						resourceClient={docsProfileClient}
						hideAgentActions
						hideConversationStarters
						hideStarButton
						hideMoreActions
					/>
				)}
			</Stack>
		</div>
	);
}

export default function AgentProfileCardTriggerPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<OpenAgentCard />
		</IntlProvider>
	);
}
