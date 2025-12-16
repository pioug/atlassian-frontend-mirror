import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	return (
		<Inline space="space.100" shouldWrap>
			{[...Array(42).keys()].map((i) => (
				<ExampleBox key={i}>{i + 1}</ExampleBox>
			))}
		</Inline>
	);
}
