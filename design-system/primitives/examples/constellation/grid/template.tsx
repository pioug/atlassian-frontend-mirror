import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
	return (
		<Grid
			testId="grid-basic"
			rowGap="space.200"
			columnGap="space.400"
			templateColumns="1fr 100px 1fr"
		>
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
