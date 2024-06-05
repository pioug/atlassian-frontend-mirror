import React from 'react';

import InlineMessage from '../src';

const MessageContent = (
	<div>
		<h4>It is so great to use data-testid</h4>
		<span>
			Visit{' '}
			<a href="https://hello.atlassian.net/wiki/spaces/AF/pages/2634728893/Testing+in+Atlassian+Frontend">
				<u>our testing website</u>
			</a>{' '}
			for more information
		</span>
	</div>
);

export default () => {
	return (
		<InlineMessage
			appearance="error"
			title="My testing Inline Message"
			secondaryText="Use data-testid for reliable testing"
			testId="the-inline-message"
		>
			{MessageContent}
		</InlineMessage>
	);
};
