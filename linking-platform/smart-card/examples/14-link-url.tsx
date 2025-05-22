import React from 'react';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import LinkUrlExample from './content/link-url';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="LinkUrl">
		<p>
			{fg('dst-a11y__replace-anchor-with-link__linking-platfo') ? (
				<Link
					href="https://atlaskit.atlassian.com/packages/linking-platform/smart-card/docs/LinkUrl"
					target="_top"
					title="LinkUrl documentation"
				>
					Documentation
				</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a
					href="https://atlaskit.atlassian.com/packages/linking-platform/smart-card/docs/LinkUrl"
					target="_top"
					title="LinkUrl documentation"
				>
					Documentation
				</a>
			)}
		</p>
		<LinkUrlExample />
	</ExampleContainer>
);
