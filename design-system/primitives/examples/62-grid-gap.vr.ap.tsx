import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Grid } from '@atlaskit/primitives/grid';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const customBorderStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderWidth: 'border.width.selected',
	borderRadius: 'radius.small',
});

const Block = () => (
	<Box xcss={customBorderStyles} backgroundColor="color.background.neutral" padding="space.600" />
);

export default function Basic(): React.JSX.Element {
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
