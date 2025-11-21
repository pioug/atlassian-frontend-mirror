import React from 'react';

import InlineMessage from '@atlaskit/inline-message';

const InlineMessageWarningExample = (): React.JSX.Element => {
	return (
		<InlineMessage appearance="warning" secondaryText="Your bill may increase">
			<p>
				<strong>Adding new users</strong>
			</p>
			<p>
				You are adding 5 new users to your selected app, if they don’t already have access to this
				app your bill may increase.
			</p>
		</InlineMessage>
	);
};

export default InlineMessageWarningExample;
