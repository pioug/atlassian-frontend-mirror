import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Grid, xcss } from '@atlaskit/primitives';

const customBorderStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderWidth: 'border.width.outline',
	borderRadius: 'border.radius',
});

const Block = () => (
	<Box xcss={customBorderStyles} backgroundColor="color.background.neutral" padding="space.600" />
);

export default function Basic() {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid testId="grid-basic" gap="space.100">
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid testId="grid-basic" gap="space.200">
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid testId="grid-basic" gap="space.400">
				<Block />
				<Block />
				<Block />
			</Grid>
		</Grid>
	);
}
