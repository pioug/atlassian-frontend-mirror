import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Example() {
	return (
		<Stack space="space.500">
			{(['space.100', 'space.200'] as const).map((space) => (
				<Inline key={space} space={space}>
					<ExampleBox />
					<ExampleBox />
					<ExampleBox />
				</Inline>
			))}
		</Stack>
	);
}
