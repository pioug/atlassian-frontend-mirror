import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example() {
	return (
		<Inline space="space.500">
			{(['space.100', 'space.200'] as const).map((space) => (
				<Stack key={space} space={space}>
					<ExampleBox />
					<ExampleBox />
					<ExampleBox />
				</Stack>
			))}
		</Inline>
	);
}
