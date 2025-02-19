import React from 'react';

import InlineMessage from '@atlaskit/inline-message';

const InlineMessageErrorExample = () => {
	return (
		<InlineMessage
			appearance="error"
			iconLabel="Error! This name is already in use. Try another."
			secondaryText="Username taken"
		>
			<p>This name is already in use. Try another.</p>
		</InlineMessage>
	);
};

export default InlineMessageErrorExample;
