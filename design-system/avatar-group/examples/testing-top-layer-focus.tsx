import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { Box } from '@atlaskit/primitives/compiled';

const data = [
	{ key: 'user-1', name: 'User One' },
	{ key: 'user-2', name: 'User Two' },
	{ key: 'user-3', name: 'User Three' },
	{ key: 'user-4', name: 'User Four' },
	{ key: 'user-5', name: 'User Five' },
	{ key: 'user-6', name: 'User Six' },
];

/**
 * Test fixture for the `AvatarGroup` top-layer focus contract.
 * See `__tests__/playwright/top-layer-focus.spec.tsx` for the asserted contract.
 */
export default function TestingTopLayerFocus(): React.ReactNode {
	return (
		<Box padding="space.200">
			<AvatarGroup
				appearance="stack"
				data={data}
				maxCount={3}
				size="medium"
				testId="avatar-group"
			/>
		</Box>
	);
}
