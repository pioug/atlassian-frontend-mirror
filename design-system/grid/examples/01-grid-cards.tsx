import React from 'react';

import Grid, { GridItem, type GridProps } from '@atlaskit/grid';
import { Box, xcss } from '@atlaskit/primitives';

const itemStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'elevation.surface.sunken',
	borderColor: 'color.border',
	borderWidth: '3px',
	borderStyle: 'solid',
	height: 'size.600',
});

export default ({
	maxWidth,
	hasInlinePadding,
}: {
	maxWidth?: GridProps['maxWidth'];
	hasInlinePadding?: GridProps['hasInlinePadding'];
}) => {
	return (
		<Grid maxWidth={maxWidth} hasInlinePadding={hasInlinePadding} testId="grid">
			<GridItem>
				<Box xcss={itemStyles} />
			</GridItem>
			{Array.from({ length: 8 }).map((_, i) => (
				<GridItem span={{ sm: 4, lg: 3 }} key={`small-items-${i}`}>
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
