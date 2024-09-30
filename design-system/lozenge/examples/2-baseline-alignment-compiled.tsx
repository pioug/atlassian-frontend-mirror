import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives';

import Lozenge from '../src/compiled';

export default () => (
	<Stack space="space.200" testId="test-container">
		<Box>
			<Heading size="xlarge" as="span">
				Heading
			</Heading>
			<Text> </Text>
			<Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-heading">
				lozenge
			</Lozenge>
		</Box>
		<Box>
			<Text size="small">Small Text</Text>
			<Text> </Text>
			<Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-11px">
				lozenge
			</Lozenge>
		</Box>
		<Box>
			<Text size="medium">Medium Text</Text>
			<Text> </Text>
			<Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-12px">
				lozenge
			</Lozenge>
		</Box>
		<Box>
			<Text size="large">Large Text</Text>
			<Text> </Text>
			<Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-14px">
				lozenge
			</Lozenge>
		</Box>
	</Stack>
);
