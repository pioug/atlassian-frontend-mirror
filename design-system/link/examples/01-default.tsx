import React from 'react';

import { Box } from '@atlaskit/primitives';

import Link from '../src';

export default function DefaultExample() {
	return (
		<Box padding="space.100">
			<Link href="#link" testId="link">
				Default link
			</Link>{' '}
			<Link href="#link" appearance="default">
				Default link with explicit appearance
			</Link>
		</Box>
	);
}
