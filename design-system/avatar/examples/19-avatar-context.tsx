/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, Stack } from '@atlaskit/primitives';

import Avatar, { AvatarContext } from '../src';

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
