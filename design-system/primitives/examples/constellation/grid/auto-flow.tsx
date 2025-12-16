import React from 'react';

import { Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Basic(): React.JSX.Element {
	return (
		<Grid autoFlow="column" gap="space.200">
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
