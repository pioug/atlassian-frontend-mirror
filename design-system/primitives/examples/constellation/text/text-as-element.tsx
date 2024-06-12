import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
	return (
		<Stack space="space.100">
			<Text>Text as {'<span>'} (default)</Text>
			<Text as="p">Text as {'<p>'}</Text>
			<Text as="strong">Text as {'<strong>'}</Text>
			<Text as="em">Text as {'<em>'}</Text>
		</Stack>
	);
};
