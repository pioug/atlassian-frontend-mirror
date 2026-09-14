import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

export default (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Text>Text weight: regular (default)</Text>
			<Text weight="medium">Text weight: medium</Text>
			<Text weight="semibold">Text weight: semibold</Text>
			<Text weight="bold">Text weight: bold</Text>
			<Text>
				Text with <Text weight="bold">bold</Text> in a sentence
			</Text>
		</Stack>
	);
};
