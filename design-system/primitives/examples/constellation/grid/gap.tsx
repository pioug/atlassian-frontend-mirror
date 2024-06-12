import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.100">
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
			<Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.200">
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
			<Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.400">
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Grid>
		</Grid>
	);
}
