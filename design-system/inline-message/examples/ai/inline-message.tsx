import React from 'react';

import InlineMessage from '@atlaskit/inline-message/inline-message';

const Examples = (): React.JSX.Element => (
	<>
		<InlineMessage
			title="Success"
			secondaryText="Your changes have been saved successfully."
			appearance="confirmation"
		>
			<p>The project name and description are up to date.</p>
		</InlineMessage>
		<InlineMessage
			title="Warning"
			secondaryText="This action cannot be undone."
			appearance="warning"
		>
			<p>Deleted items can’t be recovered. Review your selection before continuing.</p>
		</InlineMessage>
		<InlineMessage
			title="Error"
			secondaryText="Something went wrong. Please try again."
			appearance="error"
		>
			<p>Check your connection, then try saving your changes again.</p>
		</InlineMessage>
	</>
);
export default Examples;
