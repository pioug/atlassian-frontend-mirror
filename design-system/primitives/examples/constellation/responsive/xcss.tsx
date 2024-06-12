import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

const cardStyles = xcss({
	borderColor: 'color.border.discovery',
	borderStyle: 'solid',
	borderWidth: 'border.width.0',
	padding: 'space.050',
	[media.above.xs]: {
		padding: 'space.100',
	},
	[media.above.sm]: {
		borderWidth: 'border.width',
		padding: 'space.150',
	},
	[media.above.md]: {
		borderWidth: 'border.width.outline',
		padding: 'space.200',
	},
});

export default () => (
	<Box xcss={cardStyles}>
		Border becomes narrower at smaller breakpoints. Try it out by resizing the browser window.
	</Box>
);
