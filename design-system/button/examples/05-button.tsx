import React from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives/compiled';

export default function ButtonExample(): React.JSX.Element {
	return (
		<Box padding="space.100">
			<Button testId="the-button">Button</Button>
		</Box>
	);
}
