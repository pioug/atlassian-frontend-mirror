import React from 'react';

import Link from '@atlaskit/link';

import InlineMessage from '../src';

const MessageContent = (
	<div>
		<h4>Authenticate heading</h4>
		<span>
			<Link href="http://www.atlassian.com">Authenticate</Link> to see more information
		</span>
	</div>
);

export default () => (
	<InlineMessage
		appearance="connectivity"
		title="JIRA Service Desk"
		secondaryText="Carrot cake chocolate bar caramels."
		placement="right"
	>
		{MessageContent}
	</InlineMessage>
);
