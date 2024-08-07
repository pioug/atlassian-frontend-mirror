import React from 'react';

import { Box } from '@atlaskit/primitives';

import Link from '../src';

export default function InverseExample() {
	return (
		<Box padding="space.100" backgroundColor="color.background.accent.purple.bolder">
			<Link href="https://atlassian.com" appearance="inverse" testId="link">
				Inverse
			</Link>
		</Box>
	);
}
