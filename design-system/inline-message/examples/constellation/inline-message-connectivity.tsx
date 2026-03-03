import React from 'react';

import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives/compiled';

const InlineMessageConnectivityExample = (): React.JSX.Element => {
	return (
		<InlineMessage
			appearance="connectivity"
			iconLabel="Log in to see more information"
			title="Access your account"
			secondaryText="Log in to see your information"
		>
			<Text as="span">
				<Link href="atlassian.design">Log in to access your account information</Link>
			</Text>
		</InlineMessage>
	);
};

export default InlineMessageConnectivityExample;
