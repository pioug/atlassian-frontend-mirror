import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example() {
	return (
		<Stack>
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Stack>
	);
}
