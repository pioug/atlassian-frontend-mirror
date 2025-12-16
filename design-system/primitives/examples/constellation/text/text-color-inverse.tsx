import React from 'react';

import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Box backgroundColor="color.background.information" padding="space.200">
				<Text weight="bold">Text color is default.</Text>
			</Box>
			<Box backgroundColor="color.background.brand.bold" padding="space.200">
				<Text weight="bold">Text color is automatically inverted.</Text>
			</Box>
			<Box backgroundColor="color.background.warning.bold" padding="space.200">
				<Text weight="bold">Text color is automatically inverted.</Text>
			</Box>
		</Stack>
	);
};
