import React from 'react';

import InlineMessage from '@atlaskit/inline-message';

const Examples = (): React.JSX.Element => (
	<>
		<InlineMessage
			title="Success"
			secondaryText="Your changes have been saved successfully."
			appearance="confirmation"
		/>
		<InlineMessage
			title="Warning"
			secondaryText="This action cannot be undone."
			appearance="warning"
		/>
		<InlineMessage
			title="Error"
			secondaryText="Something went wrong. Please try again."
			appearance="error"
		/>
	</>
);
export default Examples;
