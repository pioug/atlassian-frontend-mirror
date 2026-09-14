import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { AvatarContext } from '@atlaskit/avatar/avatar-context';
import Heading from '@atlaskit/heading/heading';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const CustomSVG = (): React.JSX.Element => (
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
