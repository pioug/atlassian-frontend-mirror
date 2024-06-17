import React from 'react';

import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Stack, Text } from '@atlaskit/primitives';

import InlineMessage from '../src';

const messageContent = (
	<Stack space="space.100">
		<Heading size="small" as="h2">
			Authenticate heading
		</Heading>
		<Text>
			<Link href="http://www.atlassian.com">Authenticate</Link> to see more information
		</Text>
	</Stack>
);

export default () => (
	<Stack space="space.200">
		<InlineMessage
			appearance="warning"
			title="JIRA Service Desk"
			secondaryText="Authenticate to see more information"
		>
			{messageContent}
		</InlineMessage>
		<InlineMessage appearance="warning" secondaryText="Authenticate to see more information">
			{messageContent}
		</InlineMessage>
	</Stack>
);
