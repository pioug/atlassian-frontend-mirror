import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

import GlobalStyleSimulator from './utils/global-style-simulator';

export default function SubtleExample(): React.JSX.Element {
	return (
		<>
			<GlobalStyleSimulator />
			<Box padding="space.100">
				<Link href="https://atlassian.com" appearance="subtle" testId="link">
					Subtle
				</Link>
			</Box>
		</>
	);
}
