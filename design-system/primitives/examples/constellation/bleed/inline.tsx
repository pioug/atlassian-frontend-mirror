import React from 'react';

import { Bleed, Box, Inline } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
	return (
		<Box padding="space.200" backgroundColor="color.background.neutral">
			<Inline space="space.100">
				<ExampleBox />
				<ExampleBox />
				<Bleed inline="space.150">
					<ExampleBox
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ position: 'relative' }}
						backgroundColor="color.background.discovery.pressed"
					/>
				</Bleed>
				<ExampleBox />
				<ExampleBox />
			</Inline>
		</Box>
	);
}
