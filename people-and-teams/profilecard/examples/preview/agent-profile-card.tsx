import React from 'react';

import { IntlProvider } from 'react-intl';

import Example from '../ai/agent-profile-card';

export default function AgentProfileCardPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<Example />
			</div>
		</IntlProvider>
	);
}
