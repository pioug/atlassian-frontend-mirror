import React from 'react';

import LinkUrlExample from './content/link-url';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="LinkUrl">
		<p>
			<a
				href="https://atlaskit.atlassian.com/packages/linking-platform/smart-card/docs/LinkUrl"
				target="_top"
				title="LinkUrl documentation"
			>
				Documentation
			</a>
		</p>
		<LinkUrlExample />
	</ExampleContainer>
);
