import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack, xcss } from '@atlaskit/primitives';

const textStyles = xcss({
	color: 'color.text',
});

const cardStyles = xcss({
	backgroundColor: 'elevation.surface',
	padding: 'space.200',
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderRadius: 'border.radius.100',
});

const MyCard = () => (
	<Box xcss={cardStyles}>
		<Stack space="space.100">
			<Heading size="medium">A Card</Heading>
			<Box xcss={textStyles}>With a description.</Box>
		</Stack>
	</Box>
);

export default MyCard;
