import React from 'react';

import { Box } from '@atlaskit/primitives';

import Link from '../src';

export default function InlineTextExample() {
	return (
		<Box padding="space.100">
			<Link href="#link" target="_blank" testId="link">
				I have an icon
			</Link>
		</Box>
	);
}
