import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example() {
	return (
		<Inline>
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Inline>
	);
}
