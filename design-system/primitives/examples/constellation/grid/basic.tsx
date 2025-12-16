import React from 'react';

import { Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Basic(): React.JSX.Element {
	return (
		<Grid gap="space.200" alignItems="center">
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
