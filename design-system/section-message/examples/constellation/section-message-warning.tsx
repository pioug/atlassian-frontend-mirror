import React from 'react';

import SectionMessage from '@atlaskit/section-message';

export default () => (
	<SectionMessage title="Cannot connect to the database" appearance="warning">
		<p>We're unable to save any progress at this time. Please try again later.</p>
	</SectionMessage>
);
