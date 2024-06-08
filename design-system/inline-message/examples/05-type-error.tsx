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
	<div>
		<InlineMessage
			appearance="error"
			title="JIRA Service Desk"
			secondaryText="Authenticate to see more information"
		>
			{MessageContent}
		</InlineMessage>
		<InlineMessage appearance="error" secondaryText="Authenticate to see more information">
			{MessageContent}
		</InlineMessage>
	</div>
);
