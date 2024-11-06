/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@emotion/react';

import Avatar, { AvatarContext } from '@atlaskit/avatar';
import { Box, Stack } from '@atlaskit/primitives';

const CustomSVG = () => (
	<Stack space="space.400">
		<Box>
			<h2>With context setting size</h2>
			<AvatarContext.Provider value={{ size: 'xlarge' }}>
				<Avatar name="Jack Johnson" />
			</AvatarContext.Provider>
		</Box>
		<Box>
			<h2>Without context setting size</h2>
			<Avatar name="John Jackson" />
		</Box>
	</Stack>
);

export default CustomSVG;
