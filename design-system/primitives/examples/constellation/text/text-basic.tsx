import React from 'react';

import { Stack, Text } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Text size="large">Text size: large</Text>
			<Text>Text size: medium (default)</Text>
			<Text size="small">Text size: small</Text>
		</Stack>
	);
};
