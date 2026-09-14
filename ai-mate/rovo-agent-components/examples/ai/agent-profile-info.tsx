import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import { Text } from '@atlaskit/primitives/compiled';
import { AgentProfileInfo } from '@atlaskit/rovo-agent-components/ui/AgentProfileInfo';

export default function AgentProfileInfoExample(): React.JSX.Element {
	const [isStarred, setIsStarred] = useState(false);

	return (
		<IntlProvider locale="en">
			<AgentProfileInfo
				agentName="Release planner"
				agentDescription="Helps teams prepare concise release updates."
				creatorRender={<Text>Created by Product Operations</Text>}
				starCountRender={<Text>24 stars</Text>}
				isStarred={isStarred}
				isHidden={false}
				onStarToggle={() => setIsStarred((value) => !value)}
			/>
		</IntlProvider>
	);
}
