import React from 'react';

import InlineMessage from '@atlaskit/inline-message';

export default (): React.JSX.Element => (
	<div>
		<InlineMessage title="Default Type">
			<p>Default type dialog</p>
		</InlineMessage>
		<br />
		<InlineMessage title="Confirmation Inline Message" appearance="confirmation">
			<p>Confirmation type dialog</p>
		</InlineMessage>
		<br />
		<InlineMessage title="Info Inline Message" appearance="info">
			<p>Info type dialog</p>
		</InlineMessage>
		<br />
		<InlineMessage title="Warning Inline Message" appearance="warning">
			<p>Warning type dialog</p>
		</InlineMessage>
		<br />
		<InlineMessage title="Error Inline Message" appearance="error">
			<p>Error type dialog</p>
		</InlineMessage>
	</div>
);
