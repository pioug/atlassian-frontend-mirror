import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

const containerStyles = xcss({
	display: 'flex',
});

export default function Example() {
	return (
		<Box testId="stack-example" padding="space.100">
			<Inline space="space.200" spread="space-between">
				<Stack alignInline="center" space="space.200">
					<Heading size="xsmall">Start alignment</Heading>
					<Box
						xcss={containerStyles}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '200px',
						}}
					>
						<Stack space="space.050" alignBlock="start">
							<ExampleBox />
							<ExampleBox />
							<ExampleBox />
						</Stack>
					</Box>
				</Stack>
				<Stack alignInline="center">
					<Heading size="xsmall">Center alignment</Heading>
					<Box
						xcss={containerStyles}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '200px',
						}}
					>
						<Stack space="space.050" alignBlock="center">
							<ExampleBox />
							<ExampleBox />
							<ExampleBox />
						</Stack>
					</Box>
				</Stack>
				<Stack alignInline="center">
					<Heading size="xsmall">End alignment</Heading>
					<Box
						xcss={containerStyles}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '200px',
						}}
					>
						<Stack space="space.050" alignBlock="end">
							<ExampleBox />
							<ExampleBox />
							<ExampleBox />
						</Stack>
					</Box>
				</Stack>
			</Inline>
		</Box>
	);
}
