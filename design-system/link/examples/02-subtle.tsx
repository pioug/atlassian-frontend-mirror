import React from 'react';

import { Box } from '@atlaskit/primitives';

import Link from '../src';

export default function SubtleExample() {
	return (
		<Box padding="space.100">
			<Link href="https://atlassian.com" appearance="subtle" testId="link">
				Subtle
			</Link>
		</Box>
	);
}
