import React from 'react';

import { Flex } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	return (
		<Flex gap="space.100" wrap="wrap">
			{[...Array(20).keys()].map((i) => (
				<ExampleBox key={i} />
			))}
		</Flex>
	);
}
