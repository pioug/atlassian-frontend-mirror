import React from 'react';

import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';
import { Stack, Text } from '@atlaskit/primitives/compiled';

const InlineMessageInfoExample = (): React.JSX.Element => {
	return (
		<InlineMessage
			appearance="info"
			title="Access your account"
			secondaryText="Log in to see your information"
		>
			<Stack space="space.100">
				<Text>Editing description require admin permissions.</Text>
				<Text as="span">
					<Link href="http://www.atlassian.com">Learn more about admin permissions</Link>
				</Text>
			</Stack>
		</InlineMessage>
	);
};

export default InlineMessageInfoExample;
