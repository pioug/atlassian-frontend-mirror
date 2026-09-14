import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Bleed } from '@atlaskit/primitives/compiled/bleed';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';

import ExampleBox from '../shared/example-box';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 1fr 1fr',
	},
	bleedItem: {
		height: '100%',
		position: 'relative',
	},
});

export default function Basic(): React.JSX.Element {
	return (
		<Box padding="space.200" backgroundColor="color.background.neutral">
			<Grid gap="space.100" xcss={gridStyles.root}>
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<Bleed all="space.150">
					<ExampleBox
						xcss={gridStyles.bleedItem}
						backgroundColor="color.background.discovery.pressed"
					/>
				</Bleed>
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
		</Box>
	);
}
