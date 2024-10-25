import React from 'react';

import SectionMessage from '@atlaskit/section-message';

export default () => (
	<SectionMessage
		title="Note: This component is designed for internal development."
		appearance="warning"
	>
		<p>
			This component has no export but its feature can be surfaced via @atlaskit/smart-card
			components.
		</p>
	</SectionMessage>
);
