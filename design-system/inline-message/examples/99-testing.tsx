import React from 'react';

import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';
import { Stack, Text } from '@atlaskit/primitives';

const messageContent = (
	<Stack space="space.100">
		<Heading size="small" as="h2">
			It is so great to use data-testid
		</Heading>
		<Text>
			Visit{' '}
			<Link href="https://hello.atlassian.net/wiki/spaces/AF/pages/2634728893/Testing+in+Atlassian+Frontend">
				our testing website
			</Link>{' '}
			for more information
		</Text>
	</Stack>
);

export default () => {
	return (
		<InlineMessage
			appearance="error"
			title="My testing Inline Message"
			secondaryText="Use data-testid for reliable testing"
			testId="the-inline-message"
		>
			{messageContent}
		</InlineMessage>
	);
};
