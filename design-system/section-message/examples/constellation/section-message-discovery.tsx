import React from 'react';

import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

export default (): React.JSX.Element => (
	<SectionMessage
		title="Your managed accounts now include Trello access"
		appearance="discovery"
		actions={<SectionMessageAction href="#">See who's using Trello</SectionMessageAction>}
	>
		<p>
			Some users haven't started using their Atlassian account for Trello. Changes you make to an
			account are reflected only if the user starts using the account for Trello.
		</p>
	</SectionMessage>
);
