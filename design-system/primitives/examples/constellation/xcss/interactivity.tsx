import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
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
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
	},
	':focus-visible': {
		outline: '2px solid',
		outlineOffset: 'space.025',
		outlineColor: 'color.border.focused',
	},
});

const InteractiveCard = () => (
	<Box xcss={cardStyles} tabIndex={0}>
		<Stack space="space.100">
			<Heading size="medium">A Card</Heading>
			<Box xcss={textStyles}>With a description.</Box>
		</Stack>
	</Box>
);

export default InteractiveCard;
