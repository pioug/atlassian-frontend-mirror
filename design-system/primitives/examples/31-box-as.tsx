import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
	width: 'size.500',
	height: 'size.500',
});

export default function Basic() {
	return (
		<Box
			backgroundColor="color.background.brand.bold"
			testId="box-basic"
			padding="space.100"
			as="ul"
			xcss={boxStyles}
		>
			<li></li>
		</Box>
	);
}
