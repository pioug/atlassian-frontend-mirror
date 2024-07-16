import React from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';

export default () => {
	return (
		<Box backgroundColor="elevation.surface.overlay" padding="space.300" xcss={cardStyles}>
			<Stack space="space.200">
				<Heading size="medium">Update profile image</Heading>
				<Stack space="space.200">
					<Text>
						Add a profile image to personalize your account and help others recognize you.
					</Text>
					<Text>Would you like to upload a new profile picture now?</Text>
				</Stack>
				<Inline space="space.100" alignInline="end">
					<Button appearance="subtle">Skip for now</Button>
					<Button appearance="primary">Upload</Button>
				</Inline>
			</Stack>
		</Box>
	);
};

const cardStyles = xcss({
	borderRadius: '3px',
	boxShadow: 'elevation.shadow.overlay',
	width: '400px',
});
