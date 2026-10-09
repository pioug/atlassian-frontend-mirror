import React from 'react';

import Grid, { type GridProps } from '@atlaskit/grid/grid';
import { GridItem } from '@atlaskit/grid/grid-item';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const itemStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'elevation.surface.sunken',
	borderColor: 'color.border',
	borderWidth: 'border.width.selected',
	borderStyle: 'solid',
	height: 'size.600',
});

export default ({
	maxWidth,
	hasInlinePadding,
}: {
	maxWidth?: GridProps['maxWidth'];
	hasInlinePadding?: GridProps['hasInlinePadding'];
}): React.JSX.Element => {
	return (
		<Grid maxWidth={maxWidth} hasInlinePadding={hasInlinePadding} testId="grid">
			<GridItem>
				<Box xcss={itemStyles} />
			</GridItem>
			{Array.from({ length: 8 }).map((_, i) => (
				<GridItem span={{ sm: 4, lg: 3 }} key={`small-items-${i}`} testId={`grid-item-${i}`}>
					<Box xcss={itemStyles}>{i + 1}</Box>
				</GridItem>
			))}

			<GridItem start={{ md: 4 }} span={{ md: 6 }}>
				<Box xcss={itemStyles}>Offset Longer</Box>
			</GridItem>

			{Array.from({ length: 8 }).map((_, i) => (
				<GridItem span={{ sm: 6 }} key={`medium-items-${i}`}>
					<Box xcss={itemStyles} />
				</GridItem>
			))}
		</Grid>
	);
};
