import React from 'react';

import InlineMessage from '../../src';

const InlineMessageSecondaryTextExample = () => {
	return (
		<InlineMessage title="Software update" secondaryText="You've been upgraded to version 5.2">
			<p>
				We've updated you to the latest version, with added stability and new security features.
			</p>
		</InlineMessage>
	);
};

export default InlineMessageSecondaryTextExample;
