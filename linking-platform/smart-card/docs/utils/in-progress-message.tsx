import React from 'react';

import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

const InProgressMessage = () => (
	<SectionMessage
		actions={[
			<SectionMessageAction href="https://atlassian.slack.com/archives/CFKGAQZRV">
				#help-linking-platform
			</SectionMessageAction>,
		]}
	>
		We are currently in the process of updating our documentation. Stay tuned!
	</SectionMessage>
);

export default InProgressMessage;
