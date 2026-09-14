import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled/stack';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	return (
		<Stack>
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Stack>
	);
}
