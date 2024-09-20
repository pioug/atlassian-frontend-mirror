import SectionMessage from '@atlaskit/section-message';
import React from 'react';

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
