import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

import GlobalStyleSimulator from './utils/global-style-simulator';

export default function DefaultExample(): React.JSX.Element {
	return (
		<>
			<GlobalStyleSimulator />
			<Box padding="space.100">
				<Link href="#link" testId="link">
					Default link
				</Link>{' '}
				<Link href="#link" appearance="default">
					Default link with explicit appearance
				</Link>
			</Box>
		</>
	);
}
