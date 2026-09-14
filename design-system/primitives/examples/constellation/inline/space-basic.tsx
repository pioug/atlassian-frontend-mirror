import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
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
