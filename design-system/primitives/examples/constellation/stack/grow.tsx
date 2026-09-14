import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	return (
		<Inline space="space.200">
			<Stack space="space.100" grow="hug">
				<ExampleBox>This content is hugged</ExampleBox>
			</Stack>
			<Stack space="space.100" grow="fill">
				<ExampleBox>Available space is filled</ExampleBox>
			</Stack>
		</Inline>
	);
}
