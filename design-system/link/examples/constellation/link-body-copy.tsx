import React from 'react';

import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives/compiled';

export default function BodyCopy() {
	return (
		<Text>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod{' '}
			<Link href="/components/link/usage">tempor incididunt ut labore et dolore magna aliqua.</Link>{' '}
			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo consequat.{' '}
			<Link href="/components/link/usage">Duis aute irure dolor in reprehenderit</Link> in voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
			proident, sunt in{' '}
			<Link href="/components/link/usage" target="_blank">
				culpa qui officia deserunt mollit anim id est laborum.
			</Link>
		</Text>
	);
}
