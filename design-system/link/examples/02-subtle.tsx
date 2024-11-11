import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives';

export default function SubtleExample() {
	return (
		<Box padding="space.100">
			<Link href="https://atlassian.com" appearance="subtle" testId="link">
				Subtle
			</Link>
		</Box>
	);
}
