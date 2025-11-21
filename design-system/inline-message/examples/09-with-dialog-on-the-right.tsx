import React from 'react';

import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';
import { Stack, Text } from '@atlaskit/primitives/compiled';

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

export default (): React.JSX.Element => (
	<InlineMessage
		appearance="connectivity"
		title="JIRA Service Desk"
		secondaryText="Carrot cake chocolate bar caramels."
		placement="right"
	>
		{messageContent}
	</InlineMessage>
);
