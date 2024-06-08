import React from 'react';

import Link from '@atlaskit/link';

import InlineMessage from '../src';

const MessageContent = (
	<div>
		<span>Authenticate heading</span>
		<span>
			<Link href="http://www.atlassian.com">Authenticate</Link> to see more information
		</span>
	</div>
);

export default () => (
	<div>
		<InlineMessage
			appearance="connectivity"
			title="JIRA Service Desk"
			secondaryText="Authenticate to see more information"
		>
			{MessageContent}
		</InlineMessage>
		<InlineMessage appearance="connectivity" secondaryText="Authenticate to see more information">
			{MessageContent}
		</InlineMessage>
	</div>
);
