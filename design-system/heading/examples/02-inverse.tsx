/* eslint-disable @atlaskit/design-system/no-deprecated-apis */
import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Grid, Stack } from '@atlaskit/primitives';

export default () => {
	return (
		<Box backgroundColor="color.background.brand.bold">
			<Grid templateColumns="1fr 1fr" gap="space.100">
				<Stack testId="headings">
					<Heading level="h900" color="inverse">
						inverse
					</Heading>
				</Stack>
				<Stack testId="headings">
					<Heading size="xxlarge">inverse</Heading>
				</Stack>
			</Grid>
		</Box>
	);
};
