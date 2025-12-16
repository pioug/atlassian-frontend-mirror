import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

const textStyles = xcss({
	color: 'color.text',
});

const cardStyles = xcss({
	backgroundColor: 'color.background.neutral',
	padding: 'space.200',
	borderColor: 'color.border',
	borderWidth: 'border.width.selected',
	borderStyle: 'solid',
	borderRadius: 'radius.xsmall',
	[media.above.xxs]: {
		backgroundColor: 'color.background.accent.red.subtler',
	},
	[media.above.xs]: {
		backgroundColor: 'color.background.accent.yellow.subtler',
	},
	[media.above.sm]: {
		backgroundColor: 'color.background.accent.green.subtler',
	},
	[media.above.md]: {
		backgroundColor: 'color.background.accent.orange.subtler',
	},
	[media.above.lg]: {
		backgroundColor: 'color.background.accent.magenta.subtler',
	},
});

const ResponsiveCard = (): React.JSX.Element => (
	<Box xcss={cardStyles} tabIndex={0}>
		<Stack space="space.100">
			<Heading size="medium">A Responsive Card</Heading>
			<Box xcss={textStyles}>Change your screen width to see me change color.</Box>
		</Stack>
	</Box>
);

export default ResponsiveCard;
