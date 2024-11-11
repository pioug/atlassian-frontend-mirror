import React from 'react';

import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';

const InlineMessageConnectivityExample = () => {
	return (
		<InlineMessage appearance="connectivity" iconLabel="Log in to see more information">
			<p>
				<Link href="atlassian.design">Log in</Link> to access your account information
			</p>
		</InlineMessage>
	);
};

export default InlineMessageConnectivityExample;
