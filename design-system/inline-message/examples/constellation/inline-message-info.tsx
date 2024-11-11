import React from 'react';

import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';

const InlineMessageInfoExample = () => {
	return (
		<InlineMessage appearance="info">
			<p>
				<strong>Test drive your new search</strong>
			</p>
			<p>We've turbocharged your search results so you can get back to doing what you do best.</p>
			<p>
				<Link href="http://www.atlassian.com">Learn more about Atlassian</Link>
			</p>
		</InlineMessage>
	);
};

export default InlineMessageInfoExample;
