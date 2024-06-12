import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
	return (
		<Grid testId="grid-basic" rowGap="space.200" columnGap="space.400" templateRows="3rem 2rem">
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
