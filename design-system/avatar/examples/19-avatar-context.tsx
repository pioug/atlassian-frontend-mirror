import React from 'react';

import Avatar, { AvatarContext } from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const CustomSVG = () => (
	<Stack space="space.400">
		<Box>
			<Heading size="large">With context setting size</Heading>
			<AvatarContext.Provider value={{ size: 'xlarge' }}>
				<Avatar name="Jack Johnson" />
			</AvatarContext.Provider>
		</Box>
		<Box>
			<Heading size="large">Without context setting size</Heading>
			<Avatar name="John Jackson" />
		</Box>
	</Stack>
);

export default CustomSVG;
