import React from 'react';

import Grid, { GridContainer, GridItem } from '@atlaskit/grid';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const itemStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'elevation.surface.raised',
	borderColor: 'color.border',
	borderWidth: 'border.width.selected',
	borderStyle: 'solid',
	height: 'size.600',
	padding: 'space.200',
});

const NestedGrid = () => {
	return (
		/* set maxWidth and hasInlinePadding on GridContainer instead of Grid */
		<GridContainer maxWidth={undefined} hasInlinePadding={true}>
			<Grid>
				<GridItem span={{ xxs: 4 }} testId="grid-item">
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
				<GridItem span={{ xxs: 4 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
				<GridItem span={{ xxs: 4 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
			</Grid>

			<Grid>
				<GridItem span={{ xxs: 4 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
				<GridItem span={{ xxs: 8 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 8</p>
					</Box>
				</GridItem>
				<GridItem span={{ xxs: 4 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
			</Grid>

			<Grid>
				<GridItem span={{ xxs: 4 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
				<GridItem span={{ xxs: 8 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 8</p>
					</Box>
				</GridItem>
				<GridItem span={{ xxs: 4 }}>
					<Box xcss={itemStyles}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<p style={{ textAlign: 'center' }}>span 4</p>
					</Box>
				</GridItem>
			</Grid>
		</GridContainer>
	);
};

export default NestedGrid;
