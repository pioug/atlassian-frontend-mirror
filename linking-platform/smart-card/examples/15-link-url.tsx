import React from 'react';

import Link from '@atlaskit/link/link';

import LinkUrlExample from './content/link-url';
import ExampleContainer from './utils/example-container';

export default (): React.JSX.Element => (
	<ExampleContainer title="LinkUrl">
		<p>
			<Link
				href="https://atlaskit.atlassian.com/packages/linking-platform/smart-card/docs/LinkUrl"
				target="_top"
				title="LinkUrl documentation"
			>
				Documentation
			</Link>
		</p>
		<LinkUrlExample />
	</ExampleContainer>
);
