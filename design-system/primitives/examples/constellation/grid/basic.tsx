import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
	return (
		<Grid gap="space.200" alignItems="center">
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
