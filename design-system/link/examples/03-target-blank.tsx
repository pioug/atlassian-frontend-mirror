import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives';

export default function InlineTextExample() {
	return (
		<Box padding="space.100">
			<Link href="#link" target="_blank" testId="link">
				I have an icon
			</Link>
		</Box>
	);
}
