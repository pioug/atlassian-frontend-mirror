import React from 'react';

import { Code } from '@atlaskit/code';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

export default function Example() {
	return (
		<Stack alignInline="start" space="space.100">
			<Inline grow="hug">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<ExampleBox style={{ display: 'block', flexGrow: 1 }}>
					Wrapping <Code>Inline</Code> is set to <Code>grow="hug"</Code>
				</ExampleBox>
			</Inline>
			<Inline grow="fill">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<ExampleBox style={{ display: 'block', flexGrow: 1 }}>
					Wrapping <Code>Inline</Code> is set to <Code>grow="fill"</Code>
				</ExampleBox>
			</Inline>
		</Stack>
	);
}
