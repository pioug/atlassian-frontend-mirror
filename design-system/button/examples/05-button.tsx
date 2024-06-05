import React from 'react';

import { Box } from '@atlaskit/primitives';

import Button from '../src/new';

export default function ButtonExample() {
	return (
		<Box padding="space.100">
			<Button testId="the-button">Button</Button>
		</Box>
	);
}
