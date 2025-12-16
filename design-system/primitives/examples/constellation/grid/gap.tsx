import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 1fr',
	},
});

export default function Basic(): React.JSX.Element {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid testId="grid-basic" gap="space.100" xcss={gridStyles.root}>
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
			<Grid testId="grid-basic" gap="space.200" xcss={gridStyles.root}>
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
			<Grid testId="grid-basic" gap="space.400" xcss={gridStyles.root}>
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
		</Grid>
	);
}
