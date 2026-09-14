import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	const [direction, setDirection] = useState<'row' | 'column'>('row');

	return (
		<Stack space="space.500">
			<Box>
				<Button
					onClick={() =>
						setDirection((oldDirection) => (oldDirection === 'row' ? 'column' : 'row'))
					}
				>
					Change direction to "{direction === 'row' ? 'column' : 'row'}"
				</Button>
			</Box>
			<Stack space="space.100">
				<Heading size="xsmall">
					Flex direction <Code>{direction}</Code>
				</Heading>
				<Flex gap="space.100" direction={direction}>
					<ExampleBox />
					<ExampleBox />
					<ExampleBox />
				</Flex>
			</Stack>
		</Stack>
	);
}
