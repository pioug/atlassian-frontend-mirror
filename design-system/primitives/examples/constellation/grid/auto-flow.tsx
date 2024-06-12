import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
	return (
		<Grid autoFlow="column" gap="space.200">
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
