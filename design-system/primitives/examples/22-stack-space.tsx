import React from 'react';

import { Box, Inline, Stack, xcss } from '../src';

const blockStyles = xcss({ borderRadius: 'border.radius.050' });
const spaceItems = [
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
] as const;

export default () => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.100">
			{spaceItems.map((space) => (
				<Stack alignInline="center">
					{space}
					<Stack space={space}>
						<Box
							xcss={blockStyles}
							padding="space.200"
							backgroundColor="color.background.discovery.bold"
						/>
						<Box
							xcss={blockStyles}
							padding="space.200"
							backgroundColor="color.background.discovery.bold"
						/>
					</Stack>
				</Stack>
			))}
		</Inline>
	</Box>
);
