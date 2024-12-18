import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

export default function InverseExample() {
	return (
		<Box padding="space.100" backgroundColor="color.background.accent.purple.bolder">
			<Link href="https://atlassian.com" appearance="inverse" testId="link">
				Inverse
			</Link>
		</Box>
	);
}
