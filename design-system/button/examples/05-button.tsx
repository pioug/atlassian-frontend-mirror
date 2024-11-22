import React from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';

export default function ButtonExample() {
	return (
		<Box padding="space.100">
			<Button testId="the-button">Button</Button>
		</Box>
	);
}
