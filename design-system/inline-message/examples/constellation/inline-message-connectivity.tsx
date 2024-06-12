import React from 'react';

import Link from '@atlaskit/link';

import InlineMessage from '../../src';

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
