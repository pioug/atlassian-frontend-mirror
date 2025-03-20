/* eslint-disable @atlaskit/design-system/no-deprecated-apis */
import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack } from '@atlaskit/primitives/compiled';

export default () => {
	return (
		<Stack space="space.100">
			<Box padding="space.050" backgroundColor="color.background.brand.bold">
				<Heading size="xxlarge">inverse</Heading>
			</Box>
			<Box padding="space.050" backgroundColor="color.background.warning.bold">
				<Heading size="xxlarge">inverse</Heading>
			</Box>
		</Stack>
	);
};
