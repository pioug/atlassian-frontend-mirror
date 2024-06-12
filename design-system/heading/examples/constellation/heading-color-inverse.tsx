import React from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import Heading from '../../src';

export default () => {
	return (
		<Stack space="space.100">
			<Box backgroundColor="elevation.surface" padding="space.200">
				<Heading size="large">Heading color is default.</Heading>
			</Box>
			<Box backgroundColor="color.background.brand.boldest" padding="space.200">
				<Heading size="large">Heading color is automatically inverted.</Heading>
			</Box>
			<Box backgroundColor="color.background.warning.bold" padding="space.200">
				<Heading size="large">Heading color is automatically inverted.</Heading>
			</Box>
		</Stack>
	);
};
