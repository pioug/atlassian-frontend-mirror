import React from 'react';

import InlineMessage from '@atlaskit/inline-message';

const InlineMessageDefaultExample = (): React.JSX.Element => {
	return (
		<InlineMessage title="Title" secondaryText="Secondary text">
			<p>Default type dialog</p>
		</InlineMessage>
	);
};

export default InlineMessageDefaultExample;
