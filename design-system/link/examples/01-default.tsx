import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

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
