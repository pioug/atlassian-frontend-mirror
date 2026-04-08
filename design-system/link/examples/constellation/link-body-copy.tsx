import React from 'react';

import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives/compiled';

export default function BodyCopy(): React.JSX.Element {
	return (
		<Text>
			When setting up a new project, start by reviewing the{' '}
			<Link href="/components/link/usage">project configuration guide</Link>. Team members can then{' '}
			<Link href="/components/link/usage">invite collaborators</Link> and set permissions from the
			project settings page. For advanced configuration, refer to the{' '}
			<Link href="/components/link/usage" target="_blank">
				Confluence space admin documentation
			</Link>{' '}
			which opens in a new window.
		</Text>
	);
}
