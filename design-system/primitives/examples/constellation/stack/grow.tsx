import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example() {
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
