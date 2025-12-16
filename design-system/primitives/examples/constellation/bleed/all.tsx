import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Bleed, Box, Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 1fr 1fr',
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
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ height: '100%', position: 'relative' }}
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
