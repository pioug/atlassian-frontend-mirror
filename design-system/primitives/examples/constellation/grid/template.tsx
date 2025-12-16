import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 100px 1fr',
	},
});

export default function Basic(): React.JSX.Element {
	return (
		<Grid testId="grid-basic" rowGap="space.200" columnGap="space.400" xcss={gridStyles.root}>
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
}
