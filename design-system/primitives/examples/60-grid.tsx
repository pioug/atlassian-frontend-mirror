import React from 'react';

import { Box, type BoxProps, Grid, xcss } from '@atlaskit/primitives';

const customBorderStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderWidth: 'border.width.outline',
	borderRadius: 'border.radius',
});

// NOTE: We just cheat with `style`, do not copy this pattern into your code…
const Block = ({ style }: { style?: BoxProps<'div'>['style'] }) => (
	<Box
		xcss={customBorderStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={style}
		backgroundColor="color.background.neutral"
		padding="space.600"
	/>
);

export default function Basic() {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid
				testId="grid-basic"
				rowGap="space.200"
				columnGap="space.400"
				templateColumns="1fr 100px 1fr"
			>
				<Block />
				<Block />
				<Block />
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid
				testId="grid-basic"
				rowGap="space.200"
				columnGap="space.400"
				templateRows="200px 100px 200px"
			>
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid
				testId="grid-basic"
				gap="space.200"
				templateAreas={['navigation navigation', 'sidenav content', 'footer footer']}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'navigation' }} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'sidenav' }} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'content' }} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'footer' }} />
			</Grid>
		</Grid>
	);
}
