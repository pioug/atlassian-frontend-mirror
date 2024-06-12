import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
	return (
		<Stack space="space.100">
			<Text weight="medium" color="color.text.discovery">
				Text color <Text weight="bold">is inherited</Text> from its parent.
			</Text>
			<Text weight="medium" color="color.text.accent.purple">
				Text color{' '}
				<Text weight="bold" color="color.text.accent.purple.bolder">
					can also be overriden.
				</Text>
			</Text>
		</Stack>
	);
};
